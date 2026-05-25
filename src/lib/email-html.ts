// Build email-safe HTML (inline styles, no external CSS rules beyond a
// single @import for webfonts) mirroring the website's ArticleBody look.
// Source of truth: blog_posts.blocks (preferred) → falls back to parsed
// markdown-ish `content`. Preserves wording exactly.
//
// Color/font values resolved from src/styles.css tokens to concrete hex +
// web-safe font stacks (email clients can't read OKLCH or CSS variables).

import { parseBlocks, type PostBlock } from "@/lib/post-blocks";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---- site-token-derived values ---------------------------------------------
const FONT_BODY = `'Libre Baskerville', Georgia, 'Times New Roman', serif`;
const FONT_DISPLAY = `'Cormorant Garamond', Georgia, 'Times New Roman', serif`;
const FONT_META = `'Libre Caslon Text', Georgia, serif`;

const C_FOREGROUND = "#7e6c2a"; // olive
const C_BODY = "#5e5022"; // foreground @ ~85%
const C_PRIMARY = "#f2673a"; // sandstone
const C_MUTED_FG = "#7a6a55";
const C_BORDER = "#d4c8b0";
const C_CALLOUT_BG = "#f4ede0";

// Inline markdown: [text](url), **bold**, *em*, _em_, bare http(s) urls.
function renderInlineHtml(text: string): string {
  if (!text) return "";
  const re =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|(https?:\/\/[^\s<>()]+)/g;
  let out = "";
  let i = 0;
  let m: RegExpExecArray | null;
  const linkStyle = `color:${C_PRIMARY};text-decoration:underline;`;
  while ((m = re.exec(text)) !== null) {
    if (m.index > i) out += esc(text.slice(i, m.index));
    if (m[1] && m[2]) {
      out += `<a href="${esc(m[2])}" style="${linkStyle}">${esc(m[1])}</a>`;
    } else if (m[3]) {
      out += `<strong>${esc(m[3])}</strong>`;
    } else if (m[4]) {
      out += `<em>${esc(m[4])}</em>`;
    } else if (m[5]) {
      out += `<em>${esc(m[5])}</em>`;
    } else if (m[6]) {
      out += `<a href="${esc(m[6])}" style="${linkStyle};word-break:break-all;">${esc(m[6])}</a>`;
    }
    i = m.index + m[0].length;
  }
  if (i < text.length) out += esc(text.slice(i));
  return out;
}

// ---- block style constants -------------------------------------------------
const P = `margin:0 0 18px 0;font-family:${FONT_BODY};font-size:18px;line-height:1.75;color:${C_BODY};`;
const H2 = `margin:48px 0 24px 0;font-family:${FONT_DISPLAY};font-style:italic;font-weight:400;font-size:30px;line-height:1.25;color:${C_FOREGROUND};`;
const H3 = `margin:40px 0 18px 0;font-family:${FONT_DISPLAY};font-style:italic;font-weight:400;font-size:24px;line-height:1.3;color:${C_FOREGROUND};`;
const IMG = `display:block;width:auto;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;margin:24px auto;`;
const CAPTION = `margin:8px 0 24px 0;font-family:${FONT_DISPLAY};font-style:italic;font-size:13px;line-height:1.5;color:${C_MUTED_FG};text-align:center;`;
const CAPTION_LEFT = `margin:8px 0 16px 0;font-family:${FONT_DISPLAY};font-style:italic;font-size:13px;line-height:1.5;color:${C_MUTED_FG};text-align:left;`;
const QUOTE = `margin:32px 0;padding:4px 0 4px 24px;border-left:2px solid ${C_PRIMARY};font-family:${FONT_DISPLAY};font-style:italic;font-size:24px;line-height:1.5;color:rgba(126,108,42,0.9);`;
const CITE = `display:block;margin-top:10px;font-family:${FONT_META};font-style:normal;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${C_MUTED_FG};`;
const CITE_PULL = `display:block;margin-top:14px;font-family:${FONT_META};font-style:normal;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${C_MUTED_FG};text-align:center;`;
const PULL = `margin:48px auto;padding:0 8px;max-width:640px;font-family:${FONT_DISPLAY};font-style:italic;font-size:32px;line-height:1.3;color:${C_FOREGROUND};text-align:center;`;
const CALLOUT = `margin:28px 0;padding:16px 20px;border-left:4px solid ${C_PRIMARY};background:${C_CALLOUT_BG};font-family:${FONT_BODY};font-size:16px;line-height:1.65;color:${C_BODY};`;
const HR = `border:0;border-top:1px solid ${C_BORDER};margin:48px 0;`;
const LEAD = `margin:0 0 28px 0;font-family:${FONT_DISPLAY};font-style:italic;font-size:20px;line-height:1.55;color:${C_FOREGROUND};`;

const FONT_IMPORT = `<style>@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Caslon+Text:ital,wght@0,400;1,400&display=swap');</style>`;

function blockToHtml(b: PostBlock): string {
  switch (b.type) {
    case "paragraph":
      return `<p style="${P}">${renderInlineHtml(b.text)}</p>`;
    case "heading":
      return b.level === 3
        ? `<h3 style="${H3}">${esc(b.text)}</h3>`
        : `<h2 style="${H2}">${esc(b.text)}</h2>`;
    case "quote":
      return `<blockquote style="${QUOTE}">"${renderInlineHtml(b.text)}"${
        b.cite ? `<cite style="${CITE}">— ${esc(b.cite)}</cite>` : ""
      }</blockquote>`;
    case "pull-quote":
      return `<div style="${PULL}">${renderInlineHtml(b.text)}${
        b.cite ? `<div style="${CITE_PULL}">— ${esc(b.cite)}</div>` : ""
      }</div>`;
    case "image": {
      const layout = b.layout ?? "hero";
      const alt = esc(b.alt ?? "");
      const src = esc(b.src);

      // Mirror ArticleBody: signature images are always capped at 180px.
      const isSignature =
        /\/signature/i.test(b.src) || /^signature/i.test(b.alt ?? "");
      if (isSignature) {
        return `<figure style="margin:24px 0;width:180px;max-width:180px;"><img src="${src}" alt="${alt}" style="display:block;width:auto;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;" /></figure>`;
      }

      const imgFull = `<img src="${src}" alt="${alt}" style="${IMG}" />`;
      if (layout === "side-right" || layout === "side-left") {
        const align = layout === "side-right" ? "right" : "left";
        const margin =
          layout === "side-right"
            ? "margin:8px 0 12px 20px;"
            : "margin:8px 20px 12px 0;";
        const sideImg = `<img src="${src}" alt="${alt}" style="display:block;width:auto;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;" />`;
        const cap = b.caption
          ? `<div style="${CAPTION_LEFT}">${esc(b.caption)}</div>`
          : "";
        return `<table align="${align}" border="0" cellpadding="0" cellspacing="0" width="44%" style="width:44%;max-width:280px;${margin}"><tr><td>${sideImg}${cap}</td></tr></table>`;
      }
      if (layout === "inline-small") {
        const smallImg = `<img src="${src}" alt="${alt}" style="display:block;width:auto;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;margin:0 auto;" />`;
        const cap = b.caption
          ? `<figcaption style="${CAPTION}">${esc(b.caption)}</figcaption>`
          : "";
        return `<figure style="margin:24px auto;max-width:380px;text-align:center;">${smallImg}${cap}</figure>`;
      }
      return `<figure style="margin:0;text-align:center;">${imgFull}${
        b.caption ? `<figcaption style="${CAPTION}">${esc(b.caption)}</figcaption>` : ""
      }</figure>`;
    }
    case "image-text": {
      const img = `<img src="${esc(b.src)}" alt="${esc(b.alt ?? "")}" style="${IMG}" />${
        b.caption ? `<div style="${CAPTION_LEFT}">${esc(b.caption)}</div>` : ""
      }`;
      const paras = b.text
        .split(/\n\s*\n/)
        .map((p) => `<p style="${P}">${renderInlineHtml(p)}</p>`)
        .join("");
      return `<div style="margin:28px 0;">${img}${paras}</div>`;
    }
    case "gallery":
      return b.images
        .map(
          (im) =>
            `<figure style="margin:0;"><img src="${esc(im.src)}" alt="${esc(im.alt ?? "")}" style="${IMG}" />${
              im.caption ? `<figcaption style="${CAPTION}">${esc(im.caption)}</figcaption>` : ""
            }</figure>`,
        )
        .join("");
    case "divider":
      return `<hr style="${HR}" />`;
    case "callout":
      return `<div style="${CALLOUT}">${renderInlineHtml(b.text)}</div>`;
    case "newsletter-cta":
      return ""; // skip in email
    default:
      return "";
  }
}

function contentToHtml(content: string): string {
  if (!content) return "";
  return content
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith("## ")) return `<h2 style="${H2}">${esc(chunk.slice(3).trim())}</h2>`;
      if (chunk.startsWith("### ")) return `<h3 style="${H3}">${esc(chunk.slice(4).trim())}</h3>`;
      if (chunk.startsWith("> ")) return `<blockquote style="${QUOTE}">${renderInlineHtml(chunk.slice(2).trim())}</blockquote>`;
      const fig = chunk.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (fig)
        return `<figure style="margin:0;"><img src="${esc(fig[2])}" alt="${esc(fig[1])}" style="${IMG}" /></figure>`;
      return `<p style="${P}">${renderInlineHtml(chunk)}</p>`;
    })
    .join("");
}

export type EmailHtmlPost = {
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  blocks: unknown;
  image_layout?: "hero" | "side" | "none" | string | null;
  date?: string | null;
  author?: string | null;
};

function formatEmailDate(iso: string): string {
  try {
    const d = iso.length === 10 ? new Date(iso + "T00:00:00") : new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d
      .toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      .toUpperCase();
  } catch {
    return "";
  }
}

const TITLE = `margin:0 0 6px 0;font-family:${FONT_DISPLAY};font-style:italic;font-weight:500;font-size:36px;line-height:1.15;color:${C_FOREGROUND};`;
const HR_HEAD = `border:0;border-top:1px solid ${C_BORDER};margin:18px 0 16px 0;`;
const BYLINE = `font-family:${FONT_META};font-weight:600;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:${C_MUTED_FG};vertical-align:middle;`;
const PORTRAIT_URL = `https://ghifedcfmauydlmexrxc.supabase.co/storage/v1/object/public/email-assets/vaisesika-portrait.jpg`;

/** Build the inner blog content as email-safe HTML. No outer template chrome. */
export function buildBlogEmailHtml(post: EmailHtmlPost): string {
  const blocks = parseBlocks(post.blocks);
  const parts: string[] = [FONT_IMPORT];

  if (post.title) {
    parts.push(`<h1 style="${TITLE}">${esc(post.title)}</h1>`);
  }
  if (post.date) {
    const d = formatEmailDate(post.date);
    if (d) parts.push(`<div style="${DATE_META}">${esc(d)}</div>`);
  }
  if (post.author) {
    parts.push(`<hr style="${HR_HEAD}" />`);
    parts.push(`<div style="${BYLINE}">By ${esc(post.author)}</div>`);
  }




  if (blocks.length > 0) {
    const hasFeaturedInBlocks =
      post.featured_image &&
      blocks.some((b) => b.type === "image" && b.src === post.featured_image);
    if (post.featured_image && !hasFeaturedInBlocks && post.image_layout !== "none") {
      parts.push(
        `<figure style="margin:0;"><img src="${esc(post.featured_image)}" alt="${esc(post.title)}" style="${IMG}" /></figure>`,
      );
    }
    for (const b of blocks) parts.push(blockToHtml(b));
  } else {
    if (post.featured_image && post.image_layout !== "none") {
      parts.push(
        `<figure style="margin:0;"><img src="${esc(post.featured_image)}" alt="${esc(post.title)}" style="${IMG}" /></figure>`,
      );
    }
    parts.push(contentToHtml(post.content ?? ""));
  }

  // Clear floats from any side-image layouts.
  parts.push(`<div style="clear:both;font-size:0;line-height:0;">&nbsp;</div>`);

  return parts.filter(Boolean).join("\n");
}

// ============================================================
// Full email document wrapper (Mailchimp raw-HTML campaigns)
// ============================================================

const BG_OUTER = "#faf6ee";
const BG_CARD = "#ffffff";

export function buildFullBlogEmailHtml(
  post: EmailHtmlPost & { slug?: string | null },
  opts: { siteUrl: string },
): string {
  const body = buildBlogEmailHtml(post);
  const postUrl = post.slug ? `${opts.siteUrl}/post/${post.slug}` : opts.siteUrl;
  const title = esc(post.title || "Fan The Spark");
  const logoUrl = `${opts.siteUrl}/email/fts-logo-stamp.png`;

  const sharePost = encodeURIComponent(postUrl);
  const shareTitle = encodeURIComponent(post.title || "Fan The Spark");
  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${sharePost}`;
  const waShare = `https://api.whatsapp.com/send?text=${shareTitle}%20${sharePost}`;
  const mailShare = `mailto:?subject=${shareTitle}&body=${shareTitle}%20${sharePost}`;

  const headStyles = `
    body { margin:0; padding:0; background:${BG_OUTER}; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; height:auto; display:block; }
    a { color:${C_PRIMARY}; }
    @media only screen and (max-width:620px) {
      .container { width:100% !important; }
      .px { padding-left:20px !important; padding-right:20px !important; }
      .brand-logo { height:52px !important; }
    }
  `;

  const ctaStyle = `display:inline-block;padding:14px 28px;background:${C_PRIMARY};color:#ffffff;font-family:${FONT_META};font-size:11px;letter-spacing:0.28em;text-transform:uppercase;text-decoration:none;border-radius:2px;`;
  const shareLabel = `font-family:${FONT_META};font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:${C_MUTED_FG};margin:0 0 10px 0;text-align:center;`;
  const shareLink = `font-family:${FONT_META};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${C_FOREGROUND};text-decoration:none;`;
  const footerText = `font-family:${FONT_META};font-size:11px;letter-spacing:0.12em;line-height:1.7;color:${C_MUTED_FG};text-align:center;`;
  const footerLink = `color:${C_MUTED_FG};text-decoration:underline;`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${title}</title>
${FONT_IMPORT}
<style>${headStyles}</style>
</head>
<body style="margin:0;padding:0;background:${BG_OUTER};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(post.excerpt ?? post.title ?? "")}</div>
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background:${BG_OUTER};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" class="container" width="640" border="0" cellpadding="0" cellspacing="0" style="width:640px;max-width:100%;background:${BG_CARD};">
      <tr><td align="center" class="px" style="padding:28px 48px 24px 48px;border-bottom:1px solid ${C_BORDER};">
        <a href="${esc(opts.siteUrl)}" style="text-decoration:none;color:${C_FOREGROUND};display:inline-block;">
          <img src="${logoUrl}" alt="Fan The Spark" class="brand-logo" height="72" style="display:block;height:72px;width:auto;border:0;margin:0 auto;" />
        </a>
      </td></tr>

      <tr><td class="px" style="padding:40px 48px 24px 48px;">
${body}
      </td></tr>
      <tr><td align="center" class="px" style="padding:8px 48px 32px 48px;">
        <a href="${esc(postUrl)}" style="${ctaStyle}">Read on the web</a>
      </td></tr>
      <tr><td align="center" class="px" style="padding:8px 48px 40px 48px;border-top:1px solid ${C_BORDER};">
        <p style="${shareLabel}">Share this story</p>
        <p style="margin:0;text-align:center;">
          <a href="${fbShare}" style="${shareLink}">Facebook</a>
          <span style="color:${C_BORDER};margin:1px 10px;">&middot;</span>
          <a href="${waShare}" style="${shareLink}">WhatsApp</a>
          <span style="color:${C_BORDER};margin:1px 10px;">&middot;</span>
          <a href="${mailShare}" style="${shareLink}">Email</a>
        </p>
      </td></tr>
      <tr><td class="px" style="padding:28px 48px 36px 48px;border-top:1px solid ${C_BORDER};background:${BG_OUTER};">
        <div style="${footerText}">
          You're receiving this because you subscribed to Fan The Spark.<br/>
          <a href="*|UNSUB|*" style="${footerLink}">Unsubscribe</a> &nbsp;·&nbsp;
          <a href="*|UPDATE_PROFILE|*" style="${footerLink}">Update preferences</a>
          <div style="margin-top:14px;">Fan The Spark &middot; San Francisco, CA &middot; USA</div>
          <div style="margin-top:6px;">&copy; *|CURRENT_YEAR|* Fan The Spark. All rights reserved.</div>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}



