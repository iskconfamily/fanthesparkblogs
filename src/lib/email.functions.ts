import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { buildBlogEmailHtml } from "@/lib/email-html";

const SITE_URL = "https://fanthesparkblogs.lovable.app";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/brevo";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden: admin only");
}

function brevoHeaders() {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
  if (!BREVO_API_KEY) throw new Error("BREVO_API_KEY missing (connect Brevo)");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": BREVO_API_KEY,
  };
}

function buildParams(post: {
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  author: string | null;
  content: string | null;
  blocks: unknown;
  image_layout: string | null;
  date?: string | null;
}) {
  const blog_html = buildBlogEmailHtml({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    featured_image: post.featured_image,
    blocks: post.blocks,
    image_layout: post.image_layout,
    date: post.date ?? null,
    author: post.author,
  });
  return {
    subject: post.title,
    title: post.title,
    excerpt: post.excerpt ?? "",
    url: `${SITE_URL}/post/${post.slug}`,
    author: post.author ?? "",
    featured_image: post.featured_image ?? "",
    slug: post.slug,
    blog_html,
  };
}


export const getBlogEmailHtml = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ postId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select("title,excerpt,content,featured_image,blocks,image_layout")
      .eq("id", data.postId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) throw new Error("Post not found");
    const html = buildBlogEmailHtml({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featured_image,
      blocks: post.blocks,
      image_layout: post.image_layout,
    });
    return { html, length: html.length };
  });

export const listBrevoTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const res = await fetch(
      `${GATEWAY_URL}/smtp/templates?templateStatus=true&limit=100&offset=0&sort=desc`,
      { method: "GET", headers: brevoHeaders() },
    );
    const body = await res.text();
    if (!res.ok) {
      return { ok: false as const, error: `${res.status}: ${body.slice(0, 200)}`, templates: [] };
    }
    const parsed = JSON.parse(body) as {
      templates?: Array<{ id: number; name: string; subject?: string; isActive?: boolean }>;
    };
    return {
      ok: true as const,
      templates: (parsed.templates ?? []).map((t) => ({
        id: t.id,
        name: t.name,
        subject: t.subject ?? null,
        isActive: t.isActive ?? false,
      })),
    };
  });

export const listBrevoLists = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const res = await fetch(
      `${GATEWAY_URL}/contacts/lists?limit=50&offset=0&sort=desc`,
      { method: "GET", headers: brevoHeaders() },
    );
    const body = await res.text();
    if (!res.ok) {
      return { ok: false as const, error: `${res.status}: ${body.slice(0, 200)}`, lists: [] };
    }
    const parsed = JSON.parse(body) as {
      lists?: Array<{ id: number; name: string; totalSubscribers?: number }>;
    };
    return {
      ok: true as const,
      lists: (parsed.lists ?? []).map((l) => ({
        id: l.id,
        name: l.name,
        totalSubscribers: l.totalSubscribers ?? 0,
      })),
    };
  });

async function sendTransactional(
  headers: Record<string, string>,
  templateId: number,
  to: Array<{ email: string; name?: string }>,
  params: Record<string, unknown>,
) {
  const res = await fetch(`${GATEWAY_URL}/smtp/email`, {
    method: "POST",
    headers,
    body: JSON.stringify({ templateId, to, params }),
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Brevo /smtp/email ${res.status}: ${body.slice(0, 300)}`);
  }
  return body;
}

async function fetchAllListContacts(
  headers: Record<string, string>,
  listId: number,
): Promise<Array<{ email: string; name?: string }>> {
  const out: Array<{ email: string; name?: string }> = [];
  const limit = 500;
  let offset = 0;
  // hard cap to avoid runaway loops
  for (let page = 0; page < 200; page++) {
    const res = await fetch(
      `${GATEWAY_URL}/contacts/lists/${listId}/contacts?limit=${limit}&offset=${offset}&sort=desc`,
      { method: "GET", headers },
    );
    const body = await res.text();
    if (!res.ok) {
      throw new Error(`Brevo list contacts ${res.status}: ${body.slice(0, 300)}`);
    }
    const parsed = JSON.parse(body) as {
      contacts?: Array<{
        email: string;
        emailBlacklisted?: boolean;
        attributes?: Record<string, unknown>;
      }>;
      count?: number;
    };
    const contacts = parsed.contacts ?? [];
    for (const c of contacts) {
      if (c.emailBlacklisted) continue;
      const first = (c.attributes?.FIRSTNAME as string | undefined) ?? "";
      const last = (c.attributes?.LASTNAME as string | undefined) ?? "";
      const name = `${first} ${last}`.trim();
      out.push(name ? { email: c.email, name } : { email: c.email });
    }
    if (contacts.length < limit) break;
    offset += limit;
  }
  return out;
}

export const sendBlogAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        postId: z.string().uuid(),
        mode: z.enum(["test", "broadcast"]),
        testEmail: z.string().email().optional(),
        templateId: z.number().int().positive(),
        listId: z.number().int().positive().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    if (data.mode === "test" && !data.testEmail) {
      throw new Error("Test email address required");
    }
    if (data.mode === "broadcast" && !data.listId) {
      throw new Error("List required for broadcast");
    }

    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select("id,title,slug,excerpt,featured_image,author,content,blocks,image_layout,published_at,created_at")
      .eq("id", data.postId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) throw new Error("Post not found");

    const params = buildParams({ ...post, date: post.published_at ?? post.created_at ?? null });
    if (!params.blog_html || params.blog_html.trim().length === 0) {
      throw new Error("blog_html is empty — add content/blocks to the post before sending.");
    }
    const headers = brevoHeaders();

    if (data.mode === "test") {
      await sendTransactional(
        headers,
        data.templateId,
        [{ email: data.testEmail! }],
        params,
      );
      return {
        mode: "test" as const,
        templateId: data.templateId,
        recipientCount: 1,
        sentTo: data.testEmail!,
        params,
      };
    }

    // broadcast — fetch list contacts and send one transactional per recipient
    const contacts = await fetchAllListContacts(headers, data.listId!);
    if (contacts.length === 0) {
      throw new Error("List has no subscribers");
    }

    let sent = 0;
    const failures: Array<{ email: string; error: string }> = [];
    // Sequential with tiny pacing — Brevo transactional limits are generous
    for (const c of contacts) {
      try {
        await sendTransactional(headers, data.templateId, [c], params);
        sent++;
      } catch (e) {
        failures.push({
          email: c.email,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    await supabaseAdmin
      .from("blog_posts")
      .update({
        announcement_sent_at: new Date().toISOString(),
        announcement_recipient_count: sent,
      })
      .eq("id", data.postId);

    return {
      mode: "broadcast" as const,
      templateId: data.templateId,
      recipientCount: sent,
      attempted: contacts.length,
      failures: failures.slice(0, 20),
      failureCount: failures.length,
      params,
    };
  });

// ============================================================
// Mailchimp Transactional (Mandrill)
// ============================================================

const MANDRILL_BASE = "https://mandrillapp.com/api/1.0";
const MANDRILL_FROM_EMAIL = "noreply@fanthesparkblogs.lovable.app";
const MANDRILL_FROM_NAME = "Fan The Spark";

function getMandrillKey() {
  const key = process.env.MANDRILL_API_KEY;
  if (!key) throw new Error("MANDRILL_API_KEY missing");
  return key;
}

async function mandrillCall(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${MANDRILL_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Mandrill ${path} ${res.status}: ${text.slice(0, 300)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Mandrill ${path}: invalid JSON: ${text.slice(0, 200)}`);
  }
}

export const listMandrillTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    try {
      const key = getMandrillKey();
      const tpls = (await mandrillCall("/templates/list", { key })) as Array<{
        slug: string;
        name: string;
        subject: string | null;
        publish_name: string | null;
      }>;
      return {
        ok: true as const,
        templates: tpls.map((t) => ({
          slug: t.slug,
          name: t.name,
          subject: t.subject ?? null,
          publishName: t.publish_name ?? null,
        })),
      };
    } catch (e) {
      return {
        ok: false as const,
        error: e instanceof Error ? e.message : String(e),
        templates: [] as Array<{ slug: string; name: string; subject: string | null; publishName: string | null }>,
      };
    }
  });

export const sendBlogAnnouncementMailchimp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        postId: z.string().uuid(),
        templateSlug: z.string().min(1).max(200),
        recipients: z.string().min(3).max(2000),
        trackingTag: z.string().max(50).optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const emails = data.recipients
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s));
    if (emails.length === 0) throw new Error("No valid recipient emails");
    if (emails.length > 25) throw new Error("Test mode: max 25 recipients");

    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select("id,title,slug,excerpt,featured_image,author,content,blocks,image_layout,published_at,created_at")
      .eq("id", data.postId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) throw new Error("Post not found");

    const params = buildParams({ ...post, date: post.published_at ?? post.created_at ?? null });
    if (!params.blog_html || params.blog_html.trim().length === 0) {
      throw new Error("blog_html is empty — add content/blocks to the post before sending.");
    }

    const tags = ["blog-announcement"];
    if (data.trackingTag) tags.push(data.trackingTag);

    const key = getMandrillKey();
    const body = {
      key,
      template_name: data.templateSlug,
      template_content: [{ name: "blog_html", content: params.blog_html }],
      message: {
        subject: post.title,
        from_email: MANDRILL_FROM_EMAIL,
        from_name: post.author || MANDRILL_FROM_NAME,
        to: emails.map((email) => ({ email, type: "to" as const })),
        tags,
        merge_language: "handlebars",
        global_merge_vars: [
          { name: "title", content: params.title },
          { name: "excerpt", content: params.excerpt },
          { name: "url", content: params.url },
          { name: "author", content: params.author },
          { name: "featured_image", content: params.featured_image },
          { name: "slug", content: params.slug },
        ],
      },
      async: false,
    };

    const result = (await mandrillCall("/messages/send-template", body)) as Array<{
      email: string;
      status: string;
      _id?: string;
      reject_reason?: string | null;
    }>;

    return {
      templateSlug: data.templateSlug,
      recipientCount: emails.length,
      results: result.map((r) => ({
        email: r.email,
        status: r.status,
        id: r._id ?? null,
        rejectReason: r.reject_reason ?? null,
      })),
    };
  });
