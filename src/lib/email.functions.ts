import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

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
}) {
  return {
    subject: post.title,
    title: post.title,
    excerpt: post.excerpt ?? "",
    url: `${SITE_URL}/post/${post.slug}`,
    author: post.author ?? "",
    featured_image: post.featured_image ?? "",
    slug: post.slug,
  };
}

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

export const sendBlogAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        postId: z.string().uuid(),
        mode: z.enum(["test", "broadcast"]),
        testEmail: z.string().email().optional(),
        campaignId: z.number().int().positive(),
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
      .select("id,title,slug,excerpt,featured_image,author")
      .eq("id", data.postId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) throw new Error("Post not found");

    const params = buildParams(post);
    const headers = brevoHeaders();

    // 1) Inject params + subject into the chosen campaign.
    const putRes = await fetch(`${GATEWAY_URL}/emailCampaigns/${data.campaignId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ params, subject: post.title }),
    });
    if (!putRes.ok) {
      const b = await putRes.text();
      throw new Error(`Brevo update campaign ${putRes.status}: ${b.slice(0, 300)}`);
    }

    // 2) Test or broadcast.
    if (data.mode === "test") {
      const res = await fetch(
        `${GATEWAY_URL}/emailCampaigns/${data.campaignId}/sendTest`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ emailTo: [data.testEmail] }),
        },
      );
      if (!res.ok) {
        const b = await res.text();
        throw new Error(`Brevo sendTest ${res.status}: ${b.slice(0, 300)}`);
      }
      return {
        mode: "test" as const,
        recipientCount: 1,
        sentTo: data.testEmail,
        params,
      };
    }

    // broadcast — sendNow
    const res = await fetch(
      `${GATEWAY_URL}/emailCampaigns/${data.campaignId}/sendNow`,
      { method: "POST", headers },
    );
    if (!res.ok) {
      const b = await res.text();
      throw new Error(`Brevo sendNow ${res.status}: ${b.slice(0, 300)}`);
    }

    // Best-effort recipient count from the campaign's lists.
    let recipientCount = 0;
    try {
      const infoRes = await fetch(
        `${GATEWAY_URL}/emailCampaigns/${data.campaignId}`,
        { method: "GET", headers },
      );
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
      campaignId: data.campaignId,
      recipientCount,
      params,
    };
  });
