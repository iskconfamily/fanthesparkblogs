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

// Mirror of src/lib/markdown-inline.tsx for email HTML:
// supports **bold**, *italic*, and [label](url). Everything is escaped first
// so user content cannot inject HTML.
function renderInlineHtml(text: string): string {
  const linkColor = "#f2673a";
  // Tokenize before escaping so the markdown syntax survives, then escape
  // each segment's text payload individually.
  type Tok =
    | { kind: "text"; v: string }
    | { kind: "bold"; v: string }
    | { kind: "italic"; v: string }
    | { kind: "link"; label: string; href: string };
  const tokens: Tok[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)|\*\*([^*]+)\*\*|\*([^*\n]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ kind: "text", v: text.slice(last, m.index) });
    if (m[1] && m[2]) tokens.push({ kind: "link", label: m[1], href: m[2] });
    else if (m[3]) tokens.push({ kind: "bold", v: m[3] });
    else if (m[4]) tokens.push({ kind: "italic", v: m[4] });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ kind: "text", v: text.slice(last) });

  return tokens
    .map((t) => {
      if (t.kind === "text") return escapeHtml(t.v);
      if (t.kind === "bold") return `<strong>${escapeHtml(t.v)}</strong>`;
      if (t.kind === "italic") return `<em>${escapeHtml(t.v)}</em>`;
      // link — href already matched http(s)://… or /… so no javascript: vector
      return `<a href="${escapeHtml(t.href)}" style="color:${linkColor};text-decoration:underline;">${escapeHtml(t.label)}</a>`;
    })
    .join("");
}

function renderParagraph(text: string) {
  return `<p style="font-family:${FONT_BODY};font-size:17px;line-height:1.75;color:${BODY_INK};margin:0 0 20px;">${renderInlineHtml(text)}</p>`;
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

type FigureLayout = "hero" | "full" | "side-right" | "side-left" | "inline-small";
type GalleryImg = { src: string; alt: string; caption?: string };
type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; level: 2 | 3 }
  | { type: "quote"; text: string; cite?: string }
  | { type: "pull-quote"; text: string; cite?: string }
  | { type: "figure"; src: string; alt: string; layout: FigureLayout; caption?: string }
  | { type: "image-text"; src: string; alt: string; text: string; imageSide: "left" | "right"; caption?: string }
  | { type: "gallery"; images: GalleryImg[]; columns: 2 | 3 }
  | { type: "divider" }
  | { type: "callout"; text: string; tone: "note" | "warning" }
  | { type: "newsletter-cta" };

function parseContentForEmail(content: string | null): ContentBlock[] {
  if (!content) return [];
  return content
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((chunk): ContentBlock => {
      if (chunk.startsWith("## ")) return { type: "h2", level: 2, text: chunk.slice(3).trim() };
      if (chunk.startsWith("### ")) return { type: "h2", level: 3, text: chunk.slice(4).trim() };
      if (chunk.startsWith("> ")) return { type: "quote", text: chunk.slice(2).trim() };
      const fig = chunk.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (fig) {
        const alt = fig[1] || "";
        const src = fig[2];
        const isSig = /\/signature/i.test(src) || /^signature/i.test(alt);
        return { type: "figure", src, alt, layout: isSig ? "inline-small" : "full" };
      }
      return { type: "p", text: chunk };
    });
}

function parseGalleryForEmail(value: unknown): GalleryImg[] {
  if (!Array.isArray(value)) return [];
  const out: GalleryImg[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    if (typeof r.src !== "string" || !r.src) continue;
    out.push({
      src: r.src,
      alt: typeof r.alt === "string" ? r.alt : "",
      caption: typeof r.caption === "string" ? r.caption : undefined,
    });
  }
  return out;
}

function jsonBlocksToEmail(blocks: unknown): ContentBlock[] {
  if (!Array.isArray(blocks)) return [];
  const out: ContentBlock[] = [];
  for (const raw of blocks) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const type = r.type;
    if (type === "paragraph" && typeof r.text === "string") {
      out.push({ type: "p", text: r.text });
    } else if (type === "heading" && typeof r.text === "string") {
      out.push({ type: "h2", level: r.level === 3 ? 3 : 2, text: r.text });
    } else if (type === "quote" && typeof r.text === "string") {
      out.push({ type: "quote", text: r.text, cite: typeof r.cite === "string" ? r.cite : undefined });
    } else if (type === "pull-quote" && typeof r.text === "string") {
      out.push({ type: "pull-quote", text: r.text, cite: typeof r.cite === "string" ? r.cite : undefined });
    } else if (type === "image" && typeof r.src === "string") {
      const alt = typeof r.alt === "string" ? r.alt : "";
      const rawLayout = typeof r.layout === "string" ? r.layout : "";
      const isSig = /\/signature/i.test(r.src as string) || /^signature/i.test(alt);
      const layout: FigureLayout = isSig
        ? "inline-small"
        : rawLayout === "hero" || rawLayout === "full" || rawLayout === "side-right" ||
          rawLayout === "side-left" || rawLayout === "inline-small"
          ? rawLayout
          : "full";
      const caption = typeof r.caption === "string" ? r.caption : undefined;
      out.push({ type: "figure", src: r.src as string, alt, layout, caption });
    } else if (type === "image-text" && typeof r.src === "string" && typeof r.text === "string") {
      out.push({
        type: "image-text",
        src: r.src as string,
        alt: typeof r.alt === "string" ? r.alt : "",
        text: r.text,
        imageSide: r.imageSide === "left" ? "left" : "right",
        caption: typeof r.caption === "string" ? r.caption : undefined,
      });
    } else if (type === "gallery") {
      const images = parseGalleryForEmail(r.images);
      if (images.length === 0) continue;
      out.push({ type: "gallery", images, columns: r.columns === 3 ? 3 : 2 });
    } else if (type === "divider") {
      out.push({ type: "divider" });
    } else if (type === "callout" && typeof r.text === "string") {
      out.push({ type: "callout", text: r.text, tone: r.tone === "warning" ? "warning" : "note" });
    } else if (type === "newsletter-cta") {
      out.push({ type: "newsletter-cta" });
    }
  }
  return out;
}

function renderImg(src: string, alt: string, extraStyle = ""): string {
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" style="display:block;width:100%;height:auto;${extraStyle}" />`;
}

function renderCaption(caption: string | undefined, align: "center" | "left" = "center"): string {
  if (!caption) return "";
  return `<span style="display:block;margin-top:8px;font-family:${FONT_DISPLAY};font-style:italic;font-size:14px;color:${MUTED};text-align:${align};">${escapeHtml(caption)}</span>`;
}

function renderImageTextTable(src: string, alt: string, text: string, side: "left" | "right", caption?: string): string {
  // Matches site's md:grid-cols-2 gap-8 — 50/50 split.
  const imgCell =
    `<td valign="top" width="50%" style="padding:0 ${side === "left" ? "16px 0 0" : "0 0 16px"};">` +
    `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" style="display:block;width:100%;height:auto;" />` +
    renderCaption(caption, "left") +
    `</td>`;
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => `<p style="font-family:${FONT_BODY};font-size:17px;line-height:1.75;color:${BODY_INK};margin:0 0 14px;">${renderInlineHtml(p)}</p>`)
    .join("");
  const textCell =
    `<td valign="top" width="50%" style="padding:0 ${side === "left" ? "0 0 16px" : "16px 0 0"};">` +
    paragraphs +
    `</td>`;
  const row = side === "left" ? `${imgCell}${textCell}` : `${textCell}${imgCell}`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:40px 0;"><tr>${row}</tr></table>`;
}

function renderGallery(images: GalleryImg[], columns: 2 | 3): string {
  const cellWidth = Math.floor(100 / columns);
  const rows: string[] = [];
  for (let i = 0; i < images.length; i += columns) {
    const cells: string[] = [];
    for (let j = 0; j < columns; j++) {
      const img = images[i + j];
      if (!img) {
        cells.push(`<td width="${cellWidth}%" style="padding:6px;"></td>`);
        continue;
      }
      cells.push(
        `<td valign="top" width="${cellWidth}%" style="padding:6px;">` +
          `<img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" style="display:block;width:100%;height:auto;" />` +
          renderCaption(img.caption, "center") +
          `</td>`,
      );
    }
    rows.push(`<tr>${cells.join("")}</tr>`);
  }
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:32px 0;">${rows.join("")}</table>`;
}

function renderNewsletterCta(): string {
  // Recipients are already subscribed — surface a "read more on the site" CTA
  // in the same Quiet Quill style as the inline newsletter component, without
  // re-prompting an email address.
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:40px 0;">` +
      `<tr><td align="center" style="border:1px solid ${HAIRLINE};background:#f5ecd9;padding:28px 24px;">` +
        `<p style="margin:0 0 8px;font-family:${FONT_META};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${MUTED};">Stay in touch</p>` +
        `<p style="margin:0 0 18px;font-family:${FONT_DISPLAY};font-style:italic;font-size:22px;line-height:1.4;color:${OLIVE};">Read more essays at Fan The Spark.</p>` +
        `<a href="${SITE_URL}" style="display:inline-block;background:${SANDSTONE};color:#ffffff;text-decoration:none;padding:12px 22px;font-family:${FONT_META};font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">Visit the journal</a>` +
      `</td></tr>` +
    `</table>`
  );
}

function renderBlocks(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === "h2") {
        const size = b.level === 3 ? 22 : 26;
        const margin = b.level === 3 ? "30px 0 12px" : "36px 0 16px";
        const Tag = b.level === 3 ? "h3" : "h2";
        return `<${Tag} style="font-family:${FONT_DISPLAY};font-style:italic;font-weight:500;font-size:${size}px;line-height:1.25;color:${OLIVE};margin:${margin};">${escapeHtml(b.text)}</${Tag}>`;
      }
      if (b.type === "quote") {
        const cite = b.cite
          ? `<cite style="display:block;margin-top:10px;font-style:normal;font-family:${FONT_META};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};">— ${escapeHtml(b.cite)}</cite>`
          : "";
        return `<blockquote style="margin:28px 0;padding:4px 0 4px 20px;border-left:2px solid ${SANDSTONE};font-family:${FONT_DISPLAY};font-style:italic;font-size:22px;line-height:1.5;color:${OLIVE};">"${renderInlineHtml(b.text)}"${cite}</blockquote>`;
      }
      if (b.type === "pull-quote") {
        const cite = b.cite
          ? `<cite style="display:block;margin-top:14px;font-style:normal;font-family:${FONT_META};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${MUTED};">— ${escapeHtml(b.cite)}</cite>`
          : "";
        return `<p style="margin:36px auto;padding:0 12px;max-width:640px;text-align:center;font-family:${FONT_DISPLAY};font-style:italic;font-weight:500;font-size:30px;line-height:1.3;color:${OLIVE};">${renderInlineHtml(b.text)}${cite}</p>`;
      }
      if (b.type === "figure") {
        // Signature stays inline-small (centered, tiny) — matches site's 180px max.
        const isSig = /signature/i.test(b.src) || /^signature/i.test(b.alt);
        if (isSig) {
          return `<p style="margin:18px 0;text-align:left;"><img src="${escapeHtml(b.src)}" alt="${escapeHtml(b.alt)}" style="display:block;max-width:180px;width:100%;height:auto;" />${renderCaption(b.caption, "left")}</p>`;
        }
        if (b.layout === "side-right" || b.layout === "side-left") {
          // Matches site's w-[44%] max-w-[280px] float.
          const align = b.layout === "side-right" ? "right" : "left";
          const margin = align === "right" ? "0 0 12px 24px" : "0 24px 12px 0";
          return `<div style="margin:8px 0;">` +
            `<img src="${escapeHtml(b.src)}" alt="${escapeHtml(b.alt)}" width="280" align="${align}" style="display:block;width:44%;max-width:280px;height:auto;margin:${margin};" />` +
            renderCaption(b.caption, "left") +
            `</div>`;
        }
        if (b.layout === "inline-small") {
          // Matches site's mx-auto w-[60%].
          return `<p style="margin:32px 0;text-align:center;"><img src="${escapeHtml(b.src)}" alt="${escapeHtml(b.alt)}" style="display:inline-block;width:60%;max-width:480px;height:auto;" />${renderCaption(b.caption, "center")}</p>`;
        }
        // hero or full — full-width.
        return `<p style="margin:32px 0;">${renderImg(b.src, b.alt)}${renderCaption(b.caption, "center")}</p>`;
      }
      if (b.type === "image-text") {
        return renderImageTextTable(b.src, b.alt, b.text, b.imageSide, b.caption);
      }
      if (b.type === "gallery") {
        return renderGallery(b.images, b.columns);
      }
      if (b.type === "divider") {
        return `<hr style="border:none;border-top:1px solid ${HAIRLINE};margin:48px 0;clear:both;" />`;
      }
      if (b.type === "callout") {
        const border = b.tone === "warning" ? "#c54a1f" : SANDSTONE;
        const bg = b.tone === "warning" ? "#fbe5d8" : "#f5ecd9";
        return `<aside style="margin:32px 0;padding:18px 22px;border-left:4px solid ${border};background:${bg};font-family:${FONT_BODY};font-size:16px;line-height:1.65;color:${BODY_INK};">${renderInlineHtml(b.text)}</aside>`;
      }
      if (b.type === "newsletter-cta") {
        return renderNewsletterCta();
      }
      return renderParagraph(b.text);
    })
    .join("\n");
}

function blocksToText(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === "h2") {
        const underline = b.level === 3 ? "~" : "-";
        return `\n${b.text}\n${underline.repeat(b.text.length)}`;
      }
      if (b.type === "quote") return `  "${b.text}"${b.cite ? ` — ${b.cite}` : ""}`;
      if (b.type === "pull-quote") return `\n  "${b.text}"${b.cite ? ` — ${b.cite}` : ""}\n`;
      if (b.type === "figure") return b.alt ? `[image: ${b.alt}]` : "[image]";
      if (b.type === "image-text") return `${b.alt ? `[image: ${b.alt}]\n` : "[image]\n"}${b.text}`;
      if (b.type === "gallery") return `[gallery: ${b.images.length} image${b.images.length === 1 ? "" : "s"}]`;
      if (b.type === "divider") return "---";
      if (b.type === "callout") return `> ${b.text}`;
      if (b.type === "newsletter-cta") return `Read more on the site: ${SITE_URL}`;
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
  blocks?: unknown;
}) {
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt ?? "");
  const author = escapeHtml(post.author ?? "");
  const url = `${SITE_URL}/post/${post.slug}`;
  const image = post.featured_image ?? "";

  // Prefer the structured blocks (AI block editor). Fall back to parsing the
  // legacy `content` text field. Last resort: excerpt + hero teaser.
  const jsonBlocks = jsonBlocksToEmail(post.blocks);
  const blocks: ContentBlock[] = jsonBlocks.length
    ? jsonBlocks
    : parseContentForEmail(post.content);

  const featuredImageHtml = image
    ? `<p style="margin:28px 0;"><img src="${escapeHtml(image)}" alt="${title}" style="display:block;width:100%;height:auto;" /></p>`
    : "";

  let bodyHtml: string;
  if (jsonBlocks.length) {
    // Blocks already include any inline images (incl. hero positioning).
    // Don't re-inject featured_image.
    bodyHtml = renderBlocks(blocks);
  } else if (blocks.length) {
    // Legacy content path: inject hero after first paragraph.
    const [firstBlock, ...remainingBlocks] = blocks;
    bodyHtml = [
      firstBlock ? renderBlocks([firstBlock]) : "",
      featuredImageHtml,
      remainingBlocks.length ? renderBlocks(remainingBlocks) : "",
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    bodyHtml = [excerpt ? renderParagraph(post.excerpt ?? "") : "", featuredImageHtml]
      .filter(Boolean)
      .join("\n");
  }

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
      .select("id,title,slug,excerpt,content,featured_image,author,blocks")
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
