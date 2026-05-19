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
}) {
  const blog_html = buildBlogEmailHtml({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    featured_image: post.featured_image,
    blocks: post.blocks,
    image_layout: post.image_layout,
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

export const listBrevoCampaigns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    // Fetch draft + queued (re-sendable). Include sent for visibility.
    const statuses = ["draft", "queued", "sent"];
    const all: Array<{
      id: number;
      name: string;
      status: string;
      subject: string | null;
      listIds: number[];
    }> = [];
    for (const status of statuses) {
      const res = await fetch(
        `${GATEWAY_URL}/emailCampaigns?type=classic&status=${status}&limit=50&offset=0`,
        { method: "GET", headers: brevoHeaders() },
      );
      const body = await res.text();
      if (!res.ok) {
        return {
          ok: false as const,
          error: `${res.status}: ${body.slice(0, 200)}`,
          campaigns: [],
        };
      }
      const parsed = JSON.parse(body) as {
        campaigns?: Array<{
          id: number;
          name: string;
          status: string;
          subject?: string;
          recipients?: { listIds?: number[] };
        }>;
      };
      for (const c of parsed.campaigns ?? []) {
        all.push({
          id: c.id,
          name: c.name,
          status: c.status,
          subject: c.subject ?? null,
          listIds: c.recipients?.listIds ?? [],
        });
      }
    }
    // Newest first by id
    all.sort((a, b) => b.id - a.id);
    return { ok: true as const, campaigns: all };
  });

export const getBrevoCampaignInfo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ campaignId: z.number().int().positive() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const headers = brevoHeaders();
    const res = await fetch(`${GATEWAY_URL}/emailCampaigns/${data.campaignId}`, {
      method: "GET",
      headers,
    });
    const body = await res.text();
    if (!res.ok) {
      return {
        ok: false as const,
        campaignId: data.campaignId,
        error: `${res.status}: ${body.slice(0, 200)}`,
      };
    }
    const parsed = JSON.parse(body) as {
      name?: string;
      status?: string;
      subject?: string;
      recipients?: { listIds?: number[] };
    };
    const listIds = parsed.recipients?.listIds ?? [];
    let totalSubscribers = 0;
    const listNames: string[] = [];
    for (const lid of listIds) {
      const lr = await fetch(`${GATEWAY_URL}/contacts/lists/${lid}`, {
        method: "GET",
        headers,
      });
      if (lr.ok) {
        const lp = JSON.parse(await lr.text()) as {
          name?: string;
          totalSubscribers?: number;
        };
        totalSubscribers += lp.totalSubscribers ?? 0;
        if (lp.name) listNames.push(lp.name);
      }
    }
    return {
      ok: true as const,
      campaignId: data.campaignId,
      name: parsed.name ?? null,
      status: parsed.status ?? null,
      subject: parsed.subject ?? null,
      listIds,
      listNames,
      totalSubscribers,
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

export const sendBlogAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        postId: z.string().uuid(),
        mode: z.enum(["test", "broadcast"]),
        testEmail: z.string().email().optional(),
        templateCampaignId: z.number().int().positive(),
        listId: z.number().int().positive().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    if (data.mode === "test" && !data.testEmail) {
      throw new Error("Test email address required");
    }

    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select("id,title,slug,excerpt,featured_image,author,content,blocks,image_layout")
      .eq("id", data.postId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) throw new Error("Post not found");

    const params = buildParams(post);
    if (!params.blog_html || params.blog_html.trim().length === 0) {
      throw new Error("blog_html is empty — add content/blocks to the post before sending.");
    }
    const headers = brevoHeaders();

    // ALWAYS clone the selected (template) campaign into a fresh draft. Brevo
    // cannot reliably re-send a campaign whose status is "sent" — sendNow on
    // a sent campaign silently delivers to ~0 recipients. Creating a new
    // draft per send guarantees a clean send + clean reporting row.
    const tplRes = await fetch(`${GATEWAY_URL}/emailCampaigns/${data.templateCampaignId}`, {
      method: "GET",
      headers,
    });
    const tplBody = await tplRes.text();
    if (!tplRes.ok) {
      throw new Error(`Brevo fetch template ${tplRes.status}: ${tplBody.slice(0, 300)}`);
    }
    const tpl = JSON.parse(tplBody) as {
      htmlContent?: string;
      sender?: { id?: number; name?: string; email?: string };
      replyTo?: string;
      recipients?: { listIds?: number[] };
    };
    if (!tpl.htmlContent || !tpl.sender) {
      throw new Error("Template campaign is missing htmlContent or sender");
    }

    // Brevo rejects payloads containing both sender.id and sender.email/name.
    // Prefer sender.id when available; otherwise fall back to email/name.
    const sender =
      tpl.sender.id != null
        ? { id: tpl.sender.id }
        : tpl.sender.email
          ? { email: tpl.sender.email, ...(tpl.sender.name ? { name: tpl.sender.name } : {}) }
          : null;
    if (!sender) {
      throw new Error("Template campaign sender has no id or email");
    }

    const listIds = data.listId
      ? [data.listId]
      : (tpl.recipients?.listIds ?? []);
    if (listIds.length === 0) {
      throw new Error("No recipient list — pick a Brevo list or use a template campaign that has one.");
    }

    const createRes = await fetch(`${GATEWAY_URL}/emailCampaigns`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: `${post.title} — ${new Date().toISOString()}`,
        subject: post.title,
        sender,
        replyTo: tpl.replyTo,
        htmlContent: tpl.htmlContent,
        recipients: { listIds },
        params,
      }),
    });
    const createBody = await createRes.text();
    if (!createRes.ok) {
      throw new Error(`Brevo create campaign ${createRes.status}: ${createBody.slice(0, 300)}`);
    }
    const created = JSON.parse(createBody) as { id: number };
    const campaignId = created.id;

    // Test or broadcast.
    if (data.mode === "test") {
      const res = await fetch(`${GATEWAY_URL}/emailCampaigns/${campaignId}/sendTest`, {
        method: "POST",
        headers,
        body: JSON.stringify({ emailTo: [data.testEmail] }),
      });
      if (!res.ok) {
        const b = await res.text();
        throw new Error(`Brevo sendTest ${res.status}: ${b.slice(0, 300)}`);
      }
      return {
        mode: "test" as const,
        recipientCount: 1,
        sentTo: data.testEmail,
        campaignId,
        params,
      };
    }

    // broadcast — sendNow
    const res = await fetch(`${GATEWAY_URL}/emailCampaigns/${campaignId}/sendNow`, {
      method: "POST",
      headers,
    });
    if (!res.ok) {
      const b = await res.text();
      throw new Error(`Brevo sendNow ${res.status}: ${b.slice(0, 300)}`);
    }

    // Best-effort recipient count from the campaign's lists.
    let recipientCount = 0;
    try {
      const infoRes = await fetch(`${GATEWAY_URL}/emailCampaigns/${campaignId}`, {
        method: "GET",
        headers,
      });
      if (infoRes.ok) {
        const info = JSON.parse(await infoRes.text()) as {
          recipients?: { listIds?: number[] };
        };
        for (const lid of info.recipients?.listIds ?? []) {
          const lr = await fetch(`${GATEWAY_URL}/contacts/lists/${lid}`, {
            method: "GET",
            headers,
          });
          if (lr.ok) {
            const lp = JSON.parse(await lr.text()) as { totalSubscribers?: number };
            recipientCount += lp.totalSubscribers ?? 0;
          }
        }
      }
    } catch {
      // ignore — non-fatal
    }

    await supabaseAdmin
      .from("blog_posts")
      .update({
        announcement_sent_at: new Date().toISOString(),
        announcement_recipient_count: recipientCount,
      })
      .eq("id", data.postId);

    return {
      mode: "broadcast" as const,
      campaignId,
      recipientCount,
      params,
    };
  });
