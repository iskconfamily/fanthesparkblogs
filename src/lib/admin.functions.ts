import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { dbPostToPost, normalizeDbPost, type DbBlogPost, type ImagePrompt } from "./blog-adapter";
import { parseBlocks, type PostBlock } from "./post-blocks";

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
    return (data ?? []).map((r) => normalizeDbPost(r as unknown as Record<string, unknown>));
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
    return row ? normalizeDbPost(row as unknown as Record<string, unknown>) : null;
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
      image_layout: data.image_layout ?? "hero",
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
      return normalizeDbPost(updated as unknown as Record<string, unknown>);
    } else {
      const { data: inserted, error } = await supabaseAdmin
        .from("blog_posts")
        .insert(payload)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return normalizeDbPost(inserted as unknown as Record<string, unknown>);
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

export const createDraftPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const stamp = Date.now().toString(36);
    const slug = `untitled-${stamp}`;
    const { data: inserted, error } = await supabaseAdmin
      .from("blog_posts")
      .insert({
        title: "Untitled",
        slug,
        status: "draft",
        tags: [],
        image_prompts: [],
        image_layout: "hero",
        blocks: [],
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return normalizeDbPost(inserted as unknown as Record<string, unknown>);
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

// ---- URL extraction (preserves hyperlinks as markdown `[text](url)`) ----
function htmlToMarkdown(html: string): string {
  // Strip <head>, scripts, styles. Try to extract the article-ish body.
  let body = html
    .replace(/<head[\s\S]*?<\/head>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<aside[\s\S]*?<\/aside>/gi, " ");

  const articleMatch = body.match(/<article[\s\S]*?<\/article>/i);
  if (articleMatch) body = articleMatch[0];

  // Convert links FIRST (before stripping tags) so URLs are preserved.
  body = body.replace(
    /<a[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_m, href: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text) return "";
      if (!/^https?:\/\//i.test(href) && !href.startsWith("mailto:")) return text;
      return `[${text}](${href})`;
    },
  );

  // Convert paragraphs / headings / breaks to newlines
  body = body
    .replace(/<\/(p|div|section|h[1-6]|li|br|tr)>/gi, "\n\n")
    .replace(/<br\s*\/?>(?!\n)/gi, "\n")
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, _l, t) => `\n\n## ${t.replace(/<[^>]+>/g, "").trim()}\n\n`);

  // Strip remaining tags, decode entities
  body = body
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return body;
}

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
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const markdown = htmlToMarkdown(html).slice(0, 60000);
    return {
      title: titleMatch ? titleMatch[1].trim() : null,
      text: markdown,
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

// ---- Block document: save & AI chat designer ----

const BlockSchema = z.object({
  id: z.string().min(1).max(100),
  type: z.enum([
    "paragraph",
    "heading",
    "quote",
    "pull-quote",
    "image",
    "image-text",
    "gallery",
    "divider",
    "callout",
    "newsletter-cta",
  ]),
  text: z.string().max(20000).optional(),
  level: z.number().int().min(2).max(3).optional(),
  cite: z.string().max(500).optional(),
  src: z.string().max(2000).optional(),
  alt: z.string().max(500).optional(),
  caption: z.string().max(500).optional(),
  layout: z.enum(["hero", "full", "side-right", "side-left", "inline-small"]).optional(),
  tone: z.enum(["note", "warning"]).optional(),
  imageSide: z.enum(["left", "right"]).optional(),
  images: z
    .array(
      z.object({
        src: z.string().max(2000),
        alt: z.string().max(500).optional(),
        caption: z.string().max(500).optional(),
      }),
    )
    .max(20)
    .optional(),
  columns: z.union([z.literal(2), z.literal(3)]).optional(),
}).passthrough();

export const updatePostBlocks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      id: z.string().uuid(),
      blocks: z.array(BlockSchema).max(500),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: updated, error } = await supabaseAdmin
      .from("blog_posts")
      .update({ blocks: data.blocks as unknown as never })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return normalizeDbPost(updated as unknown as Record<string, unknown>);
  });

async function lovableImage(prompt: string): Promise<string> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{
        role: "user",
        content: `Generate a 16:9 atmospheric editorial image (no text, no watermarks) for a literary bhakti / wisdom blog. Visual: ${prompt}`,
      }],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) throw new Error(`Image gen failed: ${res.status}`);
  const json = await res.json();
  const dataUrl: string | undefined = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!dataUrl) throw new Error("No image returned");
  const m = dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/);
  if (!m) throw new Error("Bad image format");
  const contentType = m[1];
  const ext = contentType.split("/")[1] || "png";
  const buffer = Buffer.from(m[2], "base64");
  const path = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabaseAdmin.storage
    .from("blog-images")
    .upload(path, buffer, { contentType, upsert: false });
  if (error) throw new Error(error.message);
  const { data: pub } = supabaseAdmin.storage.from("blog-images").getPublicUrl(path);
  return pub.publicUrl;
}

const CHAT_SYSTEM_PROMPT = `You are a friendly design partner helping the user shape a single blog post on The Quiet Quill — a contemplative literary site with established typography. Have a real back-and-forth conversation — answer questions, give opinions, ask clarifying questions when something is ambiguous, and only call the edit_post tool when the user actually wants you to change the post.

When the user asks a question like "where is the draft?", "what does this look like?", "what would you suggest?" — just answer in plain text. Do NOT call edit_post.

When the user gives a design instruction ("add a hero image", "move the lamp image to the right of paragraph 2", "make this a quote", "add a pull quote here", "use a gallery for these images", "make this image + text") — call edit_post with the operations and a short message.

The post is a document made of typed blocks.

Block types:
- paragraph { id, type:"paragraph", text }   // text may contain inline markdown links [label](https://…)
- heading { id, type:"heading", level:2|3, text }
- quote { id, type:"quote", text, cite? }    // standard left-rule blockquote
- pull-quote { id, type:"pull-quote", text, cite? }   // large centered display quote
- image { id, type:"image", src, alt?, caption?, layout: "hero"|"full"|"side-right"|"side-left"|"inline-small" }
- image-text { id, type:"image-text", src, alt?, caption?, text, imageSide:"left"|"right" }  // side-by-side image + paragraph
- gallery { id, type:"gallery", images:[{src,alt?,caption?},…], columns:2|3 }
- divider { id, type:"divider" }
- callout { id, type:"callout", tone:"note"|"warning", text }
- newsletter-cta { id, type:"newsletter-cta" }   // inline newsletter signup

Image layouts:
- "hero" / "full": large image spanning the column width.
- "side-right" / "side-left": small image (~280px) floated; following paragraphs wrap around it.
- "inline-small": centered, ~60% width.

You respond by calling the edit_post tool with a list of operations and a short message. Operations:
- { op:"insert", afterId: string|null, block: <block without id, server assigns> }
  (afterId: null inserts at the very top.)
- { op:"update", id: string, patch: { ...fields to change } }
- { op:"move", id: string, afterId: string|null }
- { op:"delete", id: string }
- { op:"generateImage", afterId: string|null, prompt: string, alt?: string, caption?: string, layout?: "hero"|"full"|"side-right"|"side-left"|"inline-small", replaceId?: string }
  (Server generates the image and either replaces the block with replaceId, or inserts a new image block after afterId.)

Rules:
- Preserve every word of existing paragraphs/quotes/headings unless the user explicitly asks to change wording. NEVER strip or rewrite inline markdown links — they are part of the content.
- Keep operations minimal: only change what the user asked for.
- Respect the existing Quiet Quill style — don't propose colored backgrounds, novel typography, or banner-heavy layouts; favor calm arrangements.
- After your changes, the same block document is rendered on the home page card AND on the post detail page — so designing once is enough.
- Always include a short human "message" explaining what you did (one or two sentences).
- If the user's instruction is ambiguous (e.g. "add an image"), pick a sensible default and mention it in your message.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

type Operation =
  | { op: "insert"; afterId: string | null; block: Record<string, unknown> }
  | { op: "update"; id: string; patch: Record<string, unknown> }
  | { op: "move"; id: string; afterId: string | null }
  | { op: "delete"; id: string }
  | {
      op: "generateImage";
      afterId: string | null;
      prompt: string;
      alt?: string;
      caption?: string;
      layout?: PostBlock extends { type: "image"; layout?: infer L } ? L : never;
      replaceId?: string;
    };

function newId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function insertAfter(blocks: PostBlock[], afterId: string | null, block: PostBlock): PostBlock[] {
  if (afterId === null) return [block, ...blocks];
  const idx = blocks.findIndex((b) => b.id === afterId);
  if (idx === -1) return [...blocks, block];
  return [...blocks.slice(0, idx + 1), block, ...blocks.slice(idx + 1)];
}

async function applyOperations(initial: PostBlock[], ops: Operation[]): Promise<PostBlock[]> {
  let blocks = [...initial];
  for (const opRaw of ops.slice(0, 20)) {
    const op = opRaw as Operation;
    if (op.op === "insert") {
      const candidate = parseBlocks([{ ...op.block, id: newId() }])[0];
      if (candidate) blocks = insertAfter(blocks, op.afterId, candidate);
    } else if (op.op === "update") {
      blocks = blocks.map((b) => {
        if (b.id !== op.id) return b;
        const merged = { ...b, ...op.patch, id: b.id, type: b.type } as Record<string, unknown>;
        const parsed = parseBlocks([merged])[0];
        return parsed ?? b;
      });
    } else if (op.op === "move") {
      const idx = blocks.findIndex((b) => b.id === op.id);
      if (idx === -1) continue;
      const [moved] = blocks.splice(idx, 1);
      blocks = insertAfter(blocks, op.afterId, moved);
    } else if (op.op === "delete") {
      blocks = blocks.filter((b) => b.id !== op.id);
    } else if (op.op === "generateImage") {
      try {
        const url = await lovableImage(op.prompt);
        const newImage = parseBlocks([{
          id: newId(),
          type: "image",
          src: url,
          alt: op.alt ?? op.prompt.slice(0, 120),
          caption: op.caption,
          layout: op.layout ?? "hero",
        }])[0];
        if (!newImage) continue;
        if (op.replaceId) {
          const idx = blocks.findIndex((b) => b.id === op.replaceId);
          if (idx !== -1) {
            blocks = [...blocks.slice(0, idx), { ...newImage, id: blocks[idx].id }, ...blocks.slice(idx + 1)];
          } else {
            blocks = insertAfter(blocks, op.afterId, newImage);
          }
        } else {
          blocks = insertAfter(blocks, op.afterId, newImage);
        }
      } catch (err) {
        console.error("generateImage op failed", err);
      }
    }
  }
  return blocks;
}

export const chatDesignPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      id: z.string().uuid(),
      messages: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(8000),
      })).max(30),
      selectedBlockId: z.string().max(100).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !row) throw new Error("Post not found");
    const post = normalizeDbPost(row as unknown as Record<string, unknown>);

    const contextSummary = {
      title: post.title,
      selectedBlockId: data.selectedBlockId ?? null,
      blocks: post.blocks,
    };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: CHAT_SYSTEM_PROMPT },
          {
            role: "system",
            content: `Current post state (JSON):\n${JSON.stringify(contextSummary).slice(0, 12000)}`,
          },
          ...data.messages,
        ],
        tools: [{
          type: "function",
          function: {
            name: "edit_post",
            description: "Apply layout edits to the post and return a short user-facing message.",
            parameters: {
              type: "object",
              properties: {
                message: { type: "string", description: "Short human-readable summary of the change (1-2 sentences)." },
                operations: {
                  type: "array",
                  description: "Ordered list of operations to apply.",
                  items: { type: "object" },
                },
              },
              required: ["message", "operations"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: "auto",
      }),
    });

    if (res.status === 429) throw new Error("Rate limit — try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace → Usage.");
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI gateway error: ${res.status} ${t.slice(0, 200)}`);
    }

    const json = await res.json();
    const msg = json.choices?.[0]?.message;
    const tc = msg?.tool_calls?.[0];

    // No tool call — it's a conversational reply. Return text, don't touch blocks.
    if (!tc) {
      const text = (msg?.content ?? "").toString().trim()
        || "Tell me what you'd like to change and I'll update the post.";
      return { message: text, blocks: post.blocks };
    }

    const args = JSON.parse(tc.function.arguments) as {
      message: string;
      operations: Operation[];
    };

    const newBlocks = await applyOperations(post.blocks, args.operations ?? []);

    const { error: saveErr } = await supabaseAdmin
      .from("blog_posts")
      .update({ blocks: newBlocks as unknown as never })
      .eq("id", data.id);
    if (saveErr) throw new Error(saveErr.message);

    return {
      message: args.message ?? "Updated the post.",
      blocks: newBlocks,
    };
  });

// ============================================================================
//  Blog Studio: layout-aware generator + rework + helpers
// ============================================================================

const STUDIO_SYSTEM_PROMPT = `You are the LAYOUT DESIGNER for The Quiet Quill — a contemplative literary blog with an established calm, editorial style (serif typography, generous whitespace, restrained quotes, no banners). You arrange a single blog post.

ABSOLUTE RULES (violating any is a failure):
1. PRESERVE THE BODY VERBATIM. Every word the author wrote must appear, in the original order, spelled exactly as given. Do NOT rewrite, paraphrase, summarize, shorten, expand, translate, or "improve" any sentence.
2. PRESERVE ALL LINKS. If the source contains markdown links \`[text](url)\`, YouTube URLs, or any http(s) links, keep them inside the corresponding paragraph/quote text. Never remove or rewrite them unless the user asked.
3. You may only:
   - split the prose into paragraph, heading, quote, pull-quote, callout blocks
   - decide where to place the images the user uploaded (as image, image-text, gallery, or featured)
   - insert at most one newsletter-cta near the end
   - insert dividers between sections when natural
   - propose 0–3 short suggested_image_prompts ONLY if no images were uploaded AND the piece would benefit
4. If the user uploaded a reference-layout image, study it for ARRANGEMENT INSPIRATION only — do NOT include that image in the output blocks.
5. Do not invent images. Only place images whose index is in the uploaded set.

OUTPUT: call the design_post tool. blocks[] uses the schema below.

Block schema:
- { type:"paragraph", text }                                          // text may contain [label](url)
- { type:"heading", level:2|3, text }
- { type:"quote", text, cite? }
- { type:"pull-quote", text, cite? }
- { type:"image", imageIndex, layout:"hero"|"full"|"side-right"|"side-left"|"inline-small", caption? }
- { type:"image-text", imageIndex, text, imageSide:"left"|"right", caption? }
- { type:"gallery", imageIndices:[…], columns:2|3 }
- { type:"divider" }
- { type:"callout", tone:"note", text }
- { type:"newsletter-cta" }

featured_image_index: the index of the image that should also be the post's featured image (or null if none of the uploaded images should be the featured one).

TAGS: suggest 1–3 short tags drawn from the post's actual themes. Avoid generic catch-all tags. Most posts should have 1–2 tags; only add a 3rd if it genuinely adds something.

STYLE GUIDANCE: Quiet Quill prefers small quiet arrangements over banner-heavy layouts. Don't open with a giant image unless it really earns it. Pull-quotes are sparing — at most one per post. Galleries only when there are 3+ thematically related images.`;

const StudioImageInput = z.object({
  url: z.string().url().max(2000),
  alt: z.string().max(300).optional(),
});

const StudioGenerateSchema = z.object({
  id: z.string().uuid(),
  markdown: z.string().min(3).max(80000),
  sourceLabel: z.string().max(500).optional(),
  images: z.array(StudioImageInput).max(20).default([]),
  referenceLayoutImageUrl: z.string().url().max(2000).optional(),
});

type StudioBlockOut =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level?: 2 | 3; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "pull-quote"; text: string; cite?: string }
  | {
      type: "image";
      imageIndex: number;
      layout?: "hero" | "full" | "side-right" | "side-left" | "inline-small";
      caption?: string;
    }
  | {
      type: "image-text";
      imageIndex: number;
      text: string;
      imageSide?: "left" | "right";
      caption?: string;
    }
  | { type: "gallery"; imageIndices: number[]; columns?: 2 | 3 }
  | { type: "divider" }
  | { type: "callout"; tone?: "note" | "warning"; text: string }
  | { type: "newsletter-cta" };

type StudioAiResult = {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  blocks: StudioBlockOut[];
  featured_image_index: number | null;
  suggested_image_prompts: { prompt: string; alt?: string }[];
};

const newBlockId = () =>
  `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

function materializeStudioBlocks(
  raw: StudioBlockOut[],
  images: { url: string; alt?: string }[],
): PostBlock[] {
  const out: PostBlock[] = [];
  for (const b of raw) {
    if (b.type === "paragraph" && typeof b.text === "string") {
      out.push({ id: newBlockId(), type: "paragraph", text: b.text });
    } else if (b.type === "heading" && typeof b.text === "string") {
      out.push({ id: newBlockId(), type: "heading", level: b.level === 3 ? 3 : 2, text: b.text });
    } else if (b.type === "quote" && typeof b.text === "string") {
      out.push({ id: newBlockId(), type: "quote", text: b.text, cite: b.cite });
    } else if (b.type === "pull-quote" && typeof b.text === "string") {
      out.push({ id: newBlockId(), type: "pull-quote", text: b.text, cite: b.cite });
    } else if (b.type === "image" && typeof b.imageIndex === "number") {
      const img = images[b.imageIndex];
      if (!img) continue;
      out.push({
        id: newBlockId(),
        type: "image",
        src: img.url,
        alt: img.alt ?? "",
        caption: b.caption,
        layout: b.layout ?? "hero",
      });
    } else if (b.type === "image-text" && typeof b.imageIndex === "number" && typeof b.text === "string") {
      const img = images[b.imageIndex];
      if (!img) continue;
      out.push({
        id: newBlockId(),
        type: "image-text",
        src: img.url,
        alt: img.alt ?? "",
        caption: b.caption,
        text: b.text,
        imageSide: b.imageSide === "left" ? "left" : "right",
      });
    } else if (b.type === "gallery" && Array.isArray(b.imageIndices)) {
      const galleryImages = b.imageIndices
        .map((i) => images[i])
        .filter((x): x is { url: string; alt?: string } => !!x)
        .map((img) => ({ src: img.url, alt: img.alt ?? "" }));
      if (galleryImages.length === 0) continue;
      out.push({
        id: newBlockId(),
        type: "gallery",
        images: galleryImages,
        columns: b.columns === 3 ? 3 : 2,
      });
    } else if (b.type === "divider") {
      out.push({ id: newBlockId(), type: "divider" });
    } else if (b.type === "callout" && typeof b.text === "string") {
      out.push({ id: newBlockId(), type: "callout", tone: b.tone === "warning" ? "warning" : "note", text: b.text });
    } else if (b.type === "newsletter-cta") {
      out.push({ id: newBlockId(), type: "newsletter-cta" });
    }
  }
  return out;
}

/**
 * Fallback: split raw markdown into Quiet Quill blocks when the AI returns
 * an empty / unusable blocks array. Preserves every word and link verbatim.
 * Handles: ##/### headings, > quotes, --- dividers, and paragraphs.
 * Drops the first H1 if present (used as the title).
 */
function markdownToBlocksFallback(
  markdown: string,
  images: { url: string; alt?: string }[],
): PostBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: PostBlock[] = [];
  let buf: string[] = [];
  let quoteBuf: string[] = [];
  let droppedH1 = false;

  const flushPara = () => {
    const t = buf.join(" ").trim();
    if (t) blocks.push({ id: newBlockId(), type: "paragraph", text: t });
    buf = [];
  };
  const flushQuote = () => {
    const t = quoteBuf.join(" ").trim();
    if (t) blocks.push({ id: newBlockId(), type: "quote", text: t });
    quoteBuf = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushQuote();
      continue;
    }
    const h1 = /^#\s+(.+)$/.exec(line);
    const h2 = /^##\s+(.+)$/.exec(line);
    const h3 = /^###\s+(.+)$/.exec(line);
    const quote = /^>\s?(.*)$/.exec(line);
    if (h1) {
      flushPara(); flushQuote();
      if (!droppedH1) { droppedH1 = true; continue; }
      blocks.push({ id: newBlockId(), type: "heading", level: 2, text: h1[1].trim() });
    } else if (h2) {
      flushPara(); flushQuote();
      blocks.push({ id: newBlockId(), type: "heading", level: 2, text: h2[1].trim() });
    } else if (h3) {
      flushPara(); flushQuote();
      blocks.push({ id: newBlockId(), type: "heading", level: 3, text: h3[1].trim() });
    } else if (/^---+$/.test(line)) {
      flushPara(); flushQuote();
      blocks.push({ id: newBlockId(), type: "divider" });
    } else if (quote) {
      flushPara();
      quoteBuf.push(quote[1]);
    } else {
      flushQuote();
      buf.push(line.trim());
    }
  }
  flushPara();
  flushQuote();

  // Place uploaded images: first as hero at top, rest distributed every ~3 paragraphs.
  if (images.length > 0) {
    const [hero, ...rest] = images;
    blocks.unshift({
      id: newBlockId(),
      type: "image",
      src: hero.url,
      alt: hero.alt ?? "",
      layout: "hero",
    });
    let inserted = 0;
    const stride = 3;
    for (let i = 0; i < rest.length; i++) {
      const target = (i + 1) * (stride + 1) + 1;
      if (target < blocks.length) {
        blocks.splice(target, 0, {
          id: newBlockId(),
          type: "image",
          src: rest[i].url,
          alt: rest[i].alt ?? "",
          layout: "full",
        });
        inserted++;
      } else {
        blocks.push({
          id: newBlockId(),
          type: "image",
          src: rest[i].url,
          alt: rest[i].alt ?? "",
          layout: "full",
        });
      }
    }
    void inserted;
  }

  return blocks;
}

async function callStudioLayoutAi(args: {
  markdown: string;
  sourceLabel?: string;
  images: { url: string; alt?: string }[];
  referenceLayoutImageUrl?: string;
  existingBlocksJson?: string;
  modeNote?: string;
}): Promise<StudioAiResult> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const imageList = args.images
    .map((img, i) => `  [${i}] ${img.url}${img.alt ? `  alt="${img.alt}"` : ""}`)
    .join("\n");

  const userTextParts: string[] = [];
  userTextParts.push(`Source label: ${args.sourceLabel ?? "pasted text"}`);
  if (args.modeNote) userTextParts.push(args.modeNote);
  if (args.existingBlocksJson) {
    userTextParts.push(
      `EXISTING BLOCKS (you are reworking layout only — preserve every text block verbatim, only re-place images):\n${args.existingBlocksJson.slice(0, 30000)}`,
    );
  }
  userTextParts.push(
    `Available images (${args.images.length}):\n${imageList || "  (none — user uploaded no images)"}`,
  );
  if (args.referenceLayoutImageUrl) {
    userTextParts.push(
      "A reference-layout image is attached below. Use it for ARRANGEMENT INSPIRATION ONLY — do not include it in the output.",
    );
  }
  userTextParts.push(
    `Body source (preserve every word and every link EXACTLY):\n"""\n${args.markdown.slice(0, 60000)}\n"""\n\nNow call design_post with the final blocks, tags, metadata, and featured_image_index.`,
  );

  const content: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } }
  > = [{ type: "text", text: userTextParts.join("\n\n") }];

  if (args.referenceLayoutImageUrl) {
    content.push({ type: "image_url", image_url: { url: args.referenceLayoutImageUrl } });
  }
  for (const img of args.images) {
    content.push({ type: "image_url", image_url: { url: img.url } });
  }

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: STUDIO_SYSTEM_PROMPT },
        { role: "user", content },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "design_post",
            description:
              "Return the post laid out as typed blocks plus metadata. Body text is verbatim from source.",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                excerpt: { type: "string" },
                category: { type: "string" },
                tags: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
                seo_title: { type: "string" },
                seo_description: { type: "string" },
                featured_image_index: { type: ["integer", "null"] },
                suggested_image_prompts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      prompt: { type: "string" },
                      alt: { type: "string" },
                    },
                    required: ["prompt"],
                  },
                  maxItems: 5,
                },
                blocks: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        enum: [
                          "paragraph",
                          "heading",
                          "quote",
                          "pull-quote",
                          "image",
                          "image-text",
                          "gallery",
                          "divider",
                          "callout",
                          "newsletter-cta",
                        ],
                      },
                      text: { type: "string" },
                      level: { type: "integer", enum: [2, 3] },
                      cite: { type: "string" },
                      imageIndex: { type: "integer" },
                      imageIndices: { type: "array", items: { type: "integer" } },
                      layout: {
                        type: "string",
                        enum: ["hero", "full", "side-right", "side-left", "inline-small"],
                      },
                      imageSide: { type: "string", enum: ["left", "right"] },
                      columns: { type: "integer", enum: [2, 3] },
                      caption: { type: "string" },
                      tone: { type: "string", enum: ["note", "warning"] },
                    },
                    required: ["type"],
                  },
                },
              },
              required: [
                "title",
                "excerpt",
                "category",
                "tags",
                "seo_title",
                "seo_description",
                "blocks",
                "featured_image_index",
              ],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "design_post" } },
    }),
  });

  if (res.status === 429) throw new Error("Rate limit — try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace → Usage.");
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway error: ${res.status} ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  const tc = json.choices?.[0]?.message?.tool_calls?.[0];
  if (!tc) throw new Error("AI returned no layout.");
  return JSON.parse(tc.function.arguments) as StudioAiResult;
}

export const studioGenerateBlog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => StudioGenerateSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const ai = await callStudioLayoutAi({
      markdown: data.markdown,
      sourceLabel: data.sourceLabel,
      images: data.images,
      referenceLayoutImageUrl: data.referenceLayoutImageUrl,
    });

    const blocks = materializeStudioBlocks(ai.blocks, data.images);
    const featuredUrl =
      ai.featured_image_index !== null && data.images[ai.featured_image_index]
        ? data.images[ai.featured_image_index].url
        : null;

    const update = {
      title: ai.title,
      excerpt: ai.excerpt,
      category: ai.category,
      tags: ai.tags.slice(0, 5),
      seo_title: ai.seo_title.slice(0, 200),
      seo_description: ai.seo_description.slice(0, 400),
      featured_image: featuredUrl,
      image_prompts: ai.suggested_image_prompts ?? [],
      blocks: blocks as unknown as never,
    };

    const { data: updated, error } = await supabaseAdmin
      .from("blog_posts")
      .update(update)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return normalizeDbPost(updated as unknown as Record<string, unknown>);
  });

const StudioReworkSchema = z.object({
  id: z.string().uuid(),
  newImages: z.array(StudioImageInput).max(20).default([]),
  note: z.string().max(2000).optional(),
});

/**
 * Re-arrange image placements (and optionally add newly uploaded images) without
 * touching the existing text content. The AI receives the current blocks plus
 * the full image inventory and returns a new block list.
 */
export const studioReworkLayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => StudioReworkSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !row) throw new Error("Post not found");
    const post = normalizeDbPost(row as unknown as Record<string, unknown>);

    // Collect markdown from existing text blocks (verbatim), and inventory of
    // existing images + newly uploaded ones.
    const existingImages: { url: string; alt?: string }[] = [];
    const textChunks: string[] = [];
    for (const b of post.blocks) {
      if (b.type === "paragraph") textChunks.push(b.text);
      else if (b.type === "heading") textChunks.push(`## ${b.text}`);
      else if (b.type === "quote") textChunks.push(`> ${b.text}`);
      else if (b.type === "pull-quote") textChunks.push(`>> ${b.text}`);
      else if (b.type === "callout") textChunks.push(b.text);
      else if (b.type === "image") existingImages.push({ url: b.src, alt: b.alt });
      else if (b.type === "image-text") {
        existingImages.push({ url: b.src, alt: b.alt });
        textChunks.push(b.text);
      } else if (b.type === "gallery") {
        for (const g of b.images) existingImages.push({ url: g.src, alt: g.alt });
      }
    }
    const allImages = [...existingImages, ...data.newImages];

    const ai = await callStudioLayoutAi({
      markdown: textChunks.join("\n\n"),
      sourceLabel: "rework",
      images: allImages,
      modeNote: data.note
        ? `User wants you to rework the layout. Note: ${data.note}`
        : "User uploaded additional images. Re-arrange the layout to incorporate them. Preserve every text block verbatim.",
    });

    const blocks = materializeStudioBlocks(ai.blocks, allImages);
    const featuredUrl =
      ai.featured_image_index !== null && allImages[ai.featured_image_index]
        ? allImages[ai.featured_image_index].url
        : (post.featured_image ?? null);

    const { data: updated, error: updErr } = await supabaseAdmin
      .from("blog_posts")
      .update({
        blocks: blocks as unknown as never,
        featured_image: featuredUrl,
      })
      .eq("id", data.id)
      .select()
      .single();
    if (updErr) throw new Error(updErr.message);
    return normalizeDbPost(updated as unknown as Record<string, unknown>);
  });

/**
 * Save the small editable fields admin can tweak in the studio
 * (title, slug, excerpt, tags, featured image, SEO).
 */
const StudioMetaSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(2000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  tags: z.array(z.string().min(1).max(80)).min(1).max(10),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().max(400).optional().nullable(),
  featured_image: z.string().url().max(2000).optional().nullable().or(z.literal("")),
});

export const studioSaveMeta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => StudioMetaSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: updated, error } = await supabaseAdmin
      .from("blog_posts")
      .update({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        category: data.category || null,
        tags: data.tags,
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        featured_image: data.featured_image || null,
      })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return normalizeDbPost(updated as unknown as Record<string, unknown>);
  });
