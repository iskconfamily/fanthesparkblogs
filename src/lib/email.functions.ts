import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { buildBlogEmailHtml, buildFullBlogEmailHtml } from "@/lib/email-html";

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
// Mailchimp Marketing (Campaigns)
// ============================================================

const MC_AUDIENCE_ID = "a97040f5e0";
const MC_FROM_NAME = "Fan The Spark";
const MC_REPLY_TO = "newsletter@fanthespark.com";

function getMailchimpKeyAndDc() {
  const key = process.env.MAILCHIMP_API_KEY;
  if (!key) throw new Error("MAILCHIMP_API_KEY missing");
  const dc = key.split("-")[1];
  if (!dc) throw new Error("MAILCHIMP_API_KEY is missing the -dc suffix (e.g. ...-us21)");
  return { key, dc };
}

async function mcCall(path: string, init: { method: string; body?: unknown }) {
  const { key, dc } = getMailchimpKeyAndDc();
  const url = `https://${dc}.api.mailchimp.com/3.0${path}`;
  const res = await fetch(url, {
    method: init.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`anystring:${key}`)}`,
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Mailchimp ${init.method} ${path} ${res.status}: ${text.slice(0, 400)}`);
  }
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Mailchimp ${path}: invalid JSON: ${text.slice(0, 200)}`);
  }
}

async function createAndPrepareCampaign(
  post: { id: string; title: string; author: string | null },
  fullHtml: string,
) {
  const created = (await mcCall("/campaigns", {
    method: "POST",
    body: {
      type: "regular",
      recipients: { list_id: MC_AUDIENCE_ID },
      settings: {
        subject_line: post.title,
        preview_text: post.title,
        title: `Blog: ${post.title} [${post.id.slice(0, 8)}]`,
        from_name: post.author || MC_FROM_NAME,
        reply_to: MC_REPLY_TO,
        to_name: "*|FNAME|*",
      },
    },
  })) as { id: string };

  await mcCall(`/campaigns/${created.id}/content`, {
    method: "PUT",
    body: { html: fullHtml },
  });

  return created.id;
}

async function loadPostAndHtml(postId: string) {
  const { data: post, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id,title,slug,excerpt,featured_image,author,content,blocks,image_layout,published_at,created_at")
    .eq("id", postId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!post) throw new Error("Post not found");

  const date = post.published_at ?? post.created_at ?? null;
  const bodyHtml = buildBlogEmailHtml({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    featured_image: post.featured_image,
    blocks: post.blocks,
    image_layout: post.image_layout,
    date,
    author: post.author,
  });
  if (!bodyHtml || bodyHtml.trim().length === 0) {
    throw new Error("Email body is empty — add content/blocks to the post before sending.");
  }
  const fullHtml = buildFullBlogEmailHtml(
    {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featured_image,
      blocks: post.blocks,
      image_layout: post.image_layout,
      date,
      author: post.author,
      slug: post.slug,
    },
    { siteUrl: SITE_URL },
  );
  return { post, fullHtml };
}


export const sendMailchimpCampaignTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        postId: z.string().uuid(),
        testEmail: z.string().email(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { post, fullHtml } = await loadPostAndHtml(data.postId);
    const campaignId = await createAndPrepareCampaign(post, fullHtml);
    await mcCall(`/campaigns/${campaignId}/actions/test`, {
      method: "POST",
      body: { test_emails: [data.testEmail], send_type: "html" },
    });
    return { campaignId, testEmail: data.testEmail };
  });

export const sendMailchimpCampaignLive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        postId: z.string().uuid(),
        confirm: z.literal(true),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { post, blogHtml } = await loadPostAndHtml(data.postId);
    const campaignId = await createAndPrepareCampaign(post, blogHtml);
    await mcCall(`/campaigns/${campaignId}/actions/send`, { method: "POST" });

    await supabaseAdmin
      .from("blog_posts")
      .update({
        announcement_sent_at: new Date().toISOString(),
      })
      .eq("id", data.postId);

    return { campaignId, audienceId: MC_AUDIENCE_ID };
  });
