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

function renderParagraph(text: string) {
  return `<p style="font-family:${FONT_BODY};font-size:17px;line-height:1.75;color:${BODY_INK};margin:0 0 20px;">${escapeHtml(text)}</p>`;
}

// Site-matching palette (derived from src/styles.css)
const PAPER_OUTER = "#fbf8f1";
const PAPER_INNER = "#fdfbf5";
const OLIVE = "#7e6c2a"; // --foreground
const BODY_INK = "#5a4a1f"; // darker olive-brown for email readability
const SANDSTONE = "#f2673a"; // --primary
const MUTED = "#8a7a55";
const HAIRLINE = "#d9cdb3";

const FONT_DISPLAY = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const FONT_BODY = "'Libre Baskerville', Georgia, 'Times New Roman', serif";
const FONT_META = "'Libre Caslon Text', Georgia, serif";

type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "figure"; src: string; alt: string };

function parseContentForEmail(content: string | null): ContentBlock[] {
  if (!content) return [];
  return content
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((chunk): ContentBlock => {
      if (chunk.startsWith("## ")) return { type: "h2", text: chunk.slice(3).trim() };
      if (chunk.startsWith("> ")) return { type: "quote", text: chunk.slice(2).trim() };
      const fig = chunk.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (fig) return { type: "figure", src: fig[2], alt: fig[1] || "" };
      return { type: "p", text: chunk };
    });
}

function renderBlocks(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === "h2") {
        return `<h2 style="font-family:${FONT_DISPLAY};font-style:italic;font-weight:500;font-size:26px;line-height:1.25;color:${OLIVE};margin:36px 0 16px;">${escapeHtml(b.text)}</h2>`;
      }
      if (b.type === "quote") {
        return `<blockquote style="margin:28px 0;padding:4px 0 4px 20px;border-left:2px solid ${SANDSTONE};font-family:${FONT_DISPLAY};font-style:italic;font-size:22px;line-height:1.5;color:${OLIVE};">${escapeHtml(b.text)}</blockquote>`;
      }
      if (b.type === "figure") {
        return `<p style="margin:24px 0;"><img src="${escapeHtml(b.src)}" alt="${escapeHtml(b.alt)}" style="display:block;width:100%;height:auto;" /></p>`;
      }
      return renderParagraph(b.text);
    })
    .join("\n");
}

function blocksToText(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === "h2") return `\n${b.text}\n${"-".repeat(b.text.length)}`;
      if (b.type === "quote") return `  "${b.text}"`;
      if (b.type === "figure") return b.alt ? `[image: ${b.alt}]` : "[image]";
      return b.text;
    })
    .join("\n\n");
}

function buildEmail(post: {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author: string | null;
}) {
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt ?? "");
  const author = escapeHtml(post.author ?? "");
  const url = `${SITE_URL}/post/${post.slug}`;
  const image = post.featured_image ?? "";
  const blocks = parseContentForEmail(post.content);
  const [firstBlock, ...remainingBlocks] = blocks;
  const featuredImageHtml = image
    ? `<p style="margin:28px 0;"><img src="${escapeHtml(image)}" alt="${title}" style="display:block;width:100%;height:auto;" /></p>`
    : "";
  const bodyHtml = blocks.length
    ? [
        firstBlock ? renderBlocks([firstBlock]) : "",
        featuredImageHtml,
        remainingBlocks.length ? renderBlocks(remainingBlocks) : "",
      ]
        .filter(Boolean)
        .join("\n")
    : [excerpt ? renderParagraph(post.excerpt ?? "") : "", featuredImageHtml]
        .filter(Boolean)
        .join("\n");

  const html = `<!doctype html>
<html><head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,400;1,500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Caslon+Text&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:${PAPER_OUTER};font-family:${FONT_BODY};color:${BODY_INK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${excerpt || title}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAPER_OUTER};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:${PAPER_INNER};">
        <tr><td style="padding:40px 44px;">
          <p style="font-family:${FONT_META};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};margin:0 0 28px;">
            New essay &middot; Fan The Spark
          </p>
          <h1 style="font-family:${FONT_DISPLAY};font-style:italic;font-weight:500;font-size:34px;line-height:1.15;margin:0 0 10px;color:${OLIVE};">
            ${title}
          </h1>
          ${author ? `<p style="font-family:${FONT_META};font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};margin:0 0 20px;">by ${author}</p>` : ""}
          <hr style="border:none;border-top:1px solid ${HAIRLINE};margin:0 0 28px;" />
          ${bodyHtml}
          <p style="margin:36px 0 8px;">
            <a href="${url}" style="display:inline-block;background:${SANDSTONE};color:#ffffff;text-decoration:none;padding:14px 26px;font-family:${FONT_META};font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">
              Read on the site
            </a>
          </p>
          <hr style="border:none;border-top:1px solid ${HAIRLINE};margin:40px 0 20px;" />
          <p style="font-family:${FONT_META};font-size:11px;letter-spacing:0.08em;color:${MUTED};margin:0;">
            You're receiving this because you subscribed to Fan The Spark essays.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const textBody = blocks.length ? blocksToText(blocks) : (post.excerpt ?? "");
  const text = `${post.title}\n${"=".repeat(post.title.length)}\n${post.author ? `by ${post.author}\n` : ""}\n${textBody}\n\nRead on the site: ${url}`;
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
      .select("id,title,slug,excerpt,content,featured_image,author")
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
