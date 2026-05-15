import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { dbPostToPost, type DbBlogPost } from "./blog-adapter";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) {
    throw new Error("Forbidden: admin only");
  }
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

export const listAllPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as DbBlogPost[];
  });

export const getPostById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row as DbBlogPost | null;
  });

// Preview (admin only) — fetch by slug regardless of status, returns Post-shape.
export const getPreviewPostBySlug = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ slug: z.string().min(1).max(255) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error || !row) return null;
    return dbPostToPost(row as DbBlogPost);
  });

const SaveSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers, hyphens"),
  excerpt: z.string().max(1000).optional().nullable(),
  content: z.string().max(100000).optional().nullable(),
  featured_image: z.string().url().max(2000).optional().nullable().or(z.literal("")),
  category: z.string().max(100).optional().nullable(),
  author: z.string().max(200).optional().nullable(),
  status: z.enum(["draft", "published"]),
});

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => SaveSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const now = new Date().toISOString();
    const payload = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content || null,
      featured_image: data.featured_image || null,
      category: data.category || null,
      author: data.author || null,
      status: data.status,
      published_at: data.status === "published" ? now : null,
    };

    if (data.id) {
      // Preserve existing published_at if already published & still published
      const { data: existing } = await supabaseAdmin
        .from("blog_posts")
        .select("status, published_at")
        .eq("id", data.id)
        .maybeSingle();
      if (existing?.status === "published" && data.status === "published" && existing.published_at) {
        payload.published_at = existing.published_at;
      }
      const { data: updated, error } = await supabaseAdmin
        .from("blog_posts")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated as DbBlogPost;
    } else {
      const { data: inserted, error } = await supabaseAdmin
        .from("blog_posts")
        .insert(payload)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return inserted as DbBlogPost;
    }
  });

export const setPostStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ id: z.string().uuid(), status: z.enum(["draft", "published"]) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const update: { status: "draft" | "published"; published_at: string | null } = {
      status: data.status,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    };
    if (data.status === "published") {
      const { data: existing } = await supabaseAdmin
        .from("blog_posts")
        .select("published_at")
        .eq("id", data.id)
        .maybeSingle();
      if (existing?.published_at) update.published_at = existing.published_at;
    }
    const { error } = await supabaseAdmin.from("blog_posts").update(update).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// AI draft generation via Lovable AI Gateway
export const generateDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ prompt: z.string().min(3).max(4000) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const system = `You are a writer drafting a contemplative bhakti / wisdom blog post for the site "sravaṇādi jala".
Tone: warm, literary, unhurried. Write in plain prose with short paragraphs.
Return ONLY a JSON object via the provided tool.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `Draft a blog post from this topic / notes:\n\n${data.prompt}\n\nUse "## " for any subheadings and a leading "> " for quotes. 4–8 paragraphs.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "draft_post",
              description: "Return the drafted blog post.",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  excerpt: { type: "string", description: "1–2 sentence summary." },
                  content: { type: "string", description: "Markdown-ish body, paragraphs separated by blank lines." },
                  category: {
                    type: "string",
                    description: "One short category, e.g. 'Bhakti Notes' or 'Wisdom'.",
                  },
                },
                required: ["title", "excerpt", "content", "category"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "draft_post" } },
      }),
    });

    if (res.status === 429) throw new Error("Rate limit exceeded — try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace → Usage.");
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI gateway error: ${res.status} ${t.slice(0, 200)}`);
    }
    const json = await res.json();
    const tc = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!tc) throw new Error("AI returned no draft.");
    const args = JSON.parse(tc.function.arguments) as {
      title: string;
      excerpt: string;
      content: string;
      category: string;
    };
    return args;
  });

// One-time bootstrap: if NO admin exists, create the first admin user.
const BootstrapSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
});

export const bootstrapFirstAdmin = createServerFn({ method: "POST" })
  .inputValidator((i) => BootstrapSchema.parse(i))
  .handler(async ({ data }) => {
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) {
      throw new Error("Admin already exists. Use the login page.");
    }
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (createErr || !created.user) {
      throw new Error(createErr?.message || "Could not create user.");
    }
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: "admin" });
    if (roleErr) throw new Error(roleErr.message);
    return { ok: true };
  });

export const hasAnyAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { count } = await supabaseAdmin
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");
  return { hasAdmin: (count ?? 0) > 0 };
});

// Image upload — returns a public URL after storing in blog-images bucket.
export const uploadImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        filename: z.string().min(1).max(255),
        contentType: z.string().min(1).max(100),
        // base64 (without data: prefix), capped at ~6MB raw
        base64: z.string().min(1).max(8_500_000),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${safeName}`;
    const buffer = Buffer.from(data.base64, "base64");
    const { error } = await supabaseAdmin.storage
      .from("blog-images")
      .upload(path, buffer, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);
    const { data: pub } = supabaseAdmin.storage.from("blog-images").getPublicUrl(path);
    return { url: pub.publicUrl };
  });
