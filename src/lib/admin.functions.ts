import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { dbPostToPost, type DbBlogPost, type ImagePrompt } from "./blog-adapter";

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
    return data as unknown as DbBlogPost[];
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
    return row as unknown as DbBlogPost | null;
  });

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
    return dbPostToPost(row as unknown as DbBlogPost);
  });

const SaveSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(2000).optional().nullable(),
  content: z.string().max(200000).optional().nullable(),
  featured_image: z.string().url().max(2000).optional().nullable().or(z.literal("")),
  category: z.string().max(100).optional().nullable(),
  author: z.string().max(200).optional().nullable(),
  status: z.enum(["draft", "published"]),
  tags: z.array(z.string().max(80)).max(30).optional(),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().max(400).optional().nullable(),
  image_prompts: z
    .array(z.object({ prompt: z.string().max(2000), alt: z.string().max(300).optional(), url: z.string().max(2000).optional() }))
    .max(20)
    .optional(),
  image_layout: z.enum(["hero", "side", "none"]).optional(),
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
      tags: data.tags ?? [],
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      image_prompts: data.image_prompts ?? [],
      published_at: data.status === "published" ? now : null,
    };

    if (data.id) {
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
      return updated as unknown as DbBlogPost;
    } else {
      const { data: inserted, error } = await supabaseAdmin
        .from("blog_posts")
        .insert(payload)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return inserted as unknown as DbBlogPost;
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

// ---- AI: Format-only blog assistant ----
// CRITICAL: This assistant must NEVER rewrite, paraphrase, summarize,
// shorten, expand, or change the wording of the source. It only:
//   - extracts the source text exactly
//   - adds formatting (headings, blank-line paragraphs, "> " quotes)
//   - inserts image placement suggestions as ![alt](IMAGE:prompt)
//   - returns metadata (title, excerpt, tags, category, SEO, image prompts)
const FORMATTER_BRIEF = `You are a STRICT FORMATTER for a contemplative bhakti / wisdom blog.

ABSOLUTE RULES — violating any of these is a failure:
1. The "content" you return MUST contain the original source text verbatim. Do NOT rewrite, paraphrase, summarize, shorten, expand, translate, "improve", or change wording in any way.
2. Do NOT add new sentences, transitions, introductions, or conclusions. Do NOT remove sentences.
3. Every word of the user's prose must appear, in the original order, spelled exactly as given.
4. You MAY only:
   - split run-on text into paragraphs with blank lines
   - insert "## Heading" lines BETWEEN paragraphs where a natural section break exists (headings are NEW lines you add — they are the only new text allowed in the body, and must be short, neutral, drawn from the content's own themes)
   - convert clearly-quoted passages to "> " blockquote lines (without changing the quoted words)
   - fix obvious whitespace / smart-quote / line-break artifacts from copy-paste
   - insert image placement suggestions on their own line: ![short alt](IMAGE:short visual prompt)
5. Do NOT change punctuation or capitalization of the author's words. Do NOT "clean up" their phrasing.
6. The excerpt, SEO description, tags, category, and image prompts ARE allowed to be your own writing (they describe the piece, they are not the piece).
7. The title may be drawn from the source if one is obvious; otherwise propose a short neutral title that uses the source's own vocabulary.

If the source is very short, return it as-is with no added headings.`;

const WizardSchema = z.object({
  sourceType: z.enum(["url", "file", "notes"]),
  sourceText: z.string().min(3).max(60000),
  sourceLabel: z.string().max(500).optional(),
});

async function runFullBlogGeneration(args: {
  sourceText: string;
  sourceLabel?: string;
}) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const userPrompt = `Source label: ${args.sourceLabel ?? "pasted text"}

Source material (preserve every word EXACTLY):
"""
${args.sourceText.slice(0, 50000)}
"""

Task: Return the source content reformatted for web display. Preserve every word of the source verbatim — only add paragraph breaks, optional "## " section headings between paragraphs, "> " for quoted passages, and 2–4 inline image placement suggestions using ![alt](IMAGE:visual prompt) on their own line. Then return metadata (title, excerpt, category, tags, SEO title, SEO description, featured image prompt).`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: FORMATTER_BRIEF },
        { role: "user", content: userPrompt },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "format_blog",
            description:
              "Return the source content reformatted (verbatim wording preserved) plus metadata.",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Short title — drawn from source if obvious." },
                excerpt: { type: "string", description: "1–2 sentence summary written by you (this is metadata, not body)." },
                content: {
                  type: "string",
                  description:
                    "The source text, VERBATIM, only with added paragraph breaks, optional '## ' headings between paragraphs, '> ' for quotes, and ![alt](IMAGE:prompt) image placement lines. No rewriting.",
                },
                category: { type: "string", description: "One short category." },
                tags: { type: "array", items: { type: "string" }, description: "3–6 short tags." },
                seo_title: { type: "string", description: "≤60 chars." },
                seo_description: { type: "string", description: "≤155 chars." },
                featured_image_prompt: {
                  type: "string",
                  description: "A single rich visual prompt for the hero image — atmospheric, no text in image.",
                },
              },
              required: [
                "title",
                "excerpt",
                "content",
                "category",
                "tags",
                "seo_title",
                "seo_description",
                "featured_image_prompt",
              ],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "format_blog" } },
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
  const args2 = JSON.parse(tc.function.arguments) as {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    seo_title: string;
    seo_description: string;
    featured_image_prompt: string;
  };

  // Extract inline IMAGE: placeholders into image_prompts and rewrite content.
  const inlinePrompts: ImagePrompt[] = [];
  const rewritten = args2.content.replace(
    /!\[([^\]]*)\]\(IMAGE:\s*([^)]+)\)/g,
    (_m, alt: string, prompt: string) => {
      const cleanPrompt = prompt.trim();
      const cleanAlt = alt.trim();
      inlinePrompts.push({ prompt: cleanPrompt, alt: cleanAlt });
      // Leave the placeholder visible to the editor, but in a safer form
      return `![${cleanAlt}](pending:${inlinePrompts.length - 1})`;
    },
  );

  return {
    ...args2,
    content: rewritten,
    image_prompts: [
      { prompt: args2.featured_image_prompt, alt: `Featured image for ${args2.title}` },
      ...inlinePrompts,
    ],
  };
}

export const generateBlogFromSource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => WizardSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    return runFullBlogGeneration({
      sourceText: data.sourceText,
      sourceLabel: data.sourceLabel ?? data.sourceType,
    });
  });

// ---- URL extraction ----
export const extractFromUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ url: z.string().url().max(2000) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const res = await fetch(data.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BlogAssistant/1.0)" },
    });
    if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status}`);
    const html = await res.text();
    // Naive but effective text extraction
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return {
      title: titleMatch ? titleMatch[1].trim() : null,
      text: cleaned.slice(0, 40000),
      url: data.url,
    };
  });

// ---- Single image generation via Lovable AI (Nano Banana) ----
export const generateBlogImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ prompt: z.string().min(3).max(2000) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: `Generate a 16:9 atmospheric editorial image (no text, no watermarks) for a literary bhakti / wisdom blog. Visual: ${data.prompt}`,
          },
        ],
        modalities: ["image", "text"],
      }),
    });
    if (res.status === 429) throw new Error("Rate limit — try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted.");
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Image gateway error: ${res.status} ${t.slice(0, 200)}`);
    }
    const json = await res.json();
    const dataUrl: string | undefined = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!dataUrl) throw new Error("No image returned.");
    const m = dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (!m) throw new Error("Bad image format.");
    const contentType = m[1];
    const ext = contentType.split("/")[1] || "png";
    const buffer = Buffer.from(m[2], "base64");
    const path = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from("blog-images")
      .upload(path, buffer, { contentType, upsert: false });
    if (error) throw new Error(error.message);
    const { data: pub } = supabaseAdmin.storage.from("blog-images").getPublicUrl(path);
    return { url: pub.publicUrl };
  });

// ---- Bootstrap & uploads ----
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

export const uploadImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        filename: z.string().min(1).max(255),
        contentType: z.string().min(1).max(100),
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
