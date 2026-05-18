import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Configured via plan: verified Brevo sender + Brevo list ID
const SENDER_EMAIL = "rameshbmsu+test@gmail.com";
const SENDER_NAME = "Fan The Spark";
const BREVO_LIST_ID = 3;
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
    "Accept": "application/json",
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": BREVO_API_KEY,
  };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmail(post: {
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  author: string | null;
}) {
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt ?? "");
  const author = escapeHtml(post.author ?? "");
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.featured_image ?? "";
  const olive = "#6b7c3a"; // olive green accent

  const html = `<!doctype html>
<html><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#faf8f3;font-family:Georgia,'Times New Roman',serif;color:#2a2a2a;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;background:#ffffff;">
    <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${olive};margin:0 0 24px;">
      New from Fan The Spark
    </p>
    ${image ? `<img src="${escapeHtml(image)}" alt="" style="width:100%;height:auto;border-radius:4px;margin-bottom:24px;" />` : ""}
    <h1 style="font-family:Georgia,serif;font-style:italic;font-size:28px;line-height:1.25;margin:0 0 12px;color:#1a1a1a;">
      ${title}
    </h1>
    ${author ? `<p style="font-size:13px;color:#777;margin:0 0 20px;">by ${author}</p>` : ""}
    ${excerpt ? `<p style="font-size:16px;line-height:1.6;margin:0 0 28px;color:#3a3a3a;">${excerpt}</p>` : ""}
    <p style="margin:0 0 32px;">
      <a href="${url}" style="display:inline-block;background:${olive};color:#ffffff;text-decoration:none;padding:12px 24px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;border-radius:2px;">
        Read full post
      </a>
    </p>
    <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
    <p style="font-size:11px;color:#999;margin:0;">
      You're receiving this because you subscribed to Fan The Spark blog updates.
    </p>
  </div>
</body></html>`;

  const text = `${post.title}\n\n${post.excerpt ?? ""}\n\nRead full post: ${url}`;
  return { html, text, subject: post.title };
}

export const sendBlogAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        postId: z.string().uuid(),
        mode: z.enum(["test", "broadcast"]),
        testEmail: z.string().email().optional(),
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

    const { html, text, subject } = buildEmail(post);
    const headers = brevoHeaders();

    if (data.mode === "test") {
      const res = await fetch(`${GATEWAY_URL}/smtp/email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          sender: { name: SENDER_NAME, email: SENDER_EMAIL },
          to: [{ email: data.testEmail }],
          subject: `[TEST] ${subject}`,
          htmlContent: html,
          textContent: text,
        }),
      });
      const body = await res.text();
      if (!res.ok) throw new Error(`Brevo error ${res.status}: ${body}`);
      return { mode: "test" as const, recipientCount: 1, sentTo: data.testEmail };
    }

    // Broadcast: fetch contacts from Brevo list, then send (BCC batches of 50)
    const contacts: string[] = [];
    let offset = 0;
    const limit = 500;
    while (true) {
      const listRes = await fetch(
        `${GATEWAY_URL}/contacts/lists/${BREVO_LIST_ID}/contacts?limit=${limit}&offset=${offset}`,
        { method: "GET", headers },
      );
      const listBody = await listRes.text();
      if (!listRes.ok) throw new Error(`Brevo list fetch ${listRes.status}: ${listBody}`);
      const parsed = JSON.parse(listBody) as { contacts?: Array<{ email: string; emailBlacklisted?: boolean }> };
      const batch = parsed.contacts ?? [];
      for (const c of batch) {
        if (!c.emailBlacklisted && c.email) contacts.push(c.email);
      }
      if (batch.length < limit) break;
      offset += limit;
      if (offset > 5000) break; // safety cap
    }

    if (contacts.length === 0) {
      throw new Error(`No contacts in Brevo list #${BREVO_LIST_ID}. Add some in Brevo first.`);
    }

    // Send via Brevo - one email per recipient (transactional API requires this)
    // Batch in groups using BCC to reduce API calls
    const BCC_BATCH = 50;
    let sent = 0;
    const errors: string[] = [];
    for (let i = 0; i < contacts.length; i += BCC_BATCH) {
      const batch = contacts.slice(i, i + BCC_BATCH);
      const res = await fetch(`${GATEWAY_URL}/smtp/email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          sender: { name: SENDER_NAME, email: SENDER_EMAIL },
          to: [{ email: SENDER_EMAIL, name: SENDER_NAME }],
          bcc: batch.map((email) => ({ email })),
          subject,
          htmlContent: html,
          textContent: text,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        errors.push(`batch ${i}: ${res.status} ${body.slice(0, 200)}`);
      } else {
        sent += batch.length;
      }
    }

    if (sent === 0) {
      throw new Error(`All batches failed: ${errors.join(" | ")}`);
    }

    // Record on the post
    await supabaseAdmin
      .from("blog_posts")
      .update({
        announcement_sent_at: new Date().toISOString(),
        announcement_recipient_count: sent,
      })
      .eq("id", data.postId);

    return {
      mode: "broadcast" as const,
      recipientCount: sent,
      totalContacts: contacts.length,
      errors: errors.length ? errors : undefined,
    };
  });

export const getBrevoListInfo = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const res = await fetch(`${GATEWAY_URL}/contacts/lists/${BREVO_LIST_ID}`, {
      method: "GET",
      headers: brevoHeaders(),
    });
    const body = await res.text();
    if (!res.ok) {
      return { ok: false, listId: BREVO_LIST_ID, error: `${res.status}: ${body.slice(0, 200)}` };
    }
    const parsed = JSON.parse(body) as { name?: string; totalSubscribers?: number };
    return {
      ok: true,
      listId: BREVO_LIST_ID,
      name: parsed.name,
      totalSubscribers: parsed.totalSubscribers ?? 0,
    };
  });
