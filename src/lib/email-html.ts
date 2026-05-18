// Build email-safe HTML (inline styles, no external CSS) for a blog post.
// Source of truth: blog_posts.blocks (preferred) → falls back to parsed
// markdown-ish `content`. Preserves wording exactly.

import { parseBlocks, type PostBlock } from "@/lib/post-blocks";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Inline markdown: [text](url), **bold**, *em*, _em_, bare http(s) urls.
function renderInlineHtml(text: string): string {
  if (!text) return "";
  const re =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|(https?:\/\/[^\s<>()]+)/g;
  let out = "";
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > i) out += esc(text.slice(i, m.index));
    if (m[1] && m[2]) {
      out += `<a href="${esc(m[2])}" style="color:#8a5a2b;text-decoration:underline;">${esc(m[1])}</a>`;
    } else if (m[3]) {
      out += `<strong>${esc(m[3])}</strong>`;
    } else if (m[4]) {
      out += `<em>${esc(m[4])}</em>`;
    } else if (m[5]) {
      out += `<em>${esc(m[5])}</em>`;
    } else if (m[6]) {
      out += `<a href="${esc(m[6])}" style="color:#8a5a2b;text-decoration:underline;word-break:break-all;">${esc(m[6])}</a>`;
    }
    i = m.index + m[0].length;
  }
  if (i < text.length) out += esc(text.slice(i));
  return out;
}

const P = `margin:0 0 18px 0;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.75;color:#262421;`;
const H2 = `margin:32px 0 14px 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:26px;line-height:1.25;color:#1a1816;`;
const H3 = `margin:28px 0 12px 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:21px;line-height:1.3;color:#1a1816;`;
const IMG = `display:block;width:100%;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;margin:18px 0;`;
const CAPTION = `margin:6px 0 18px 0;font-family:Georgia,serif;font-style:italic;font-size:13px;line-height:1.5;color:#776f66;text-align:center;`;
const QUOTE = `margin:24px 0;padding:4px 0 4px 20px;border-left:3px solid #8a5a2b;font-family:Georgia,serif;font-style:italic;font-size:20px;line-height:1.55;color:#3a352f;`;
const CITE = `display:block;margin-top:8px;font-style:normal;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#776f66;`;
const PULL = `margin:36px auto;padding:0 8px;max-width:560px;font-family:Georgia,serif;font-style:italic;font-size:24px;line-height:1.35;color:#1a1816;text-align:center;`;
const CALLOUT = `margin:24px 0;padding:14px 18px;border-left:4px solid #8a5a2b;background:#faf6f1;font-family:Georgia,serif;font-size:16px;line-height:1.65;color:#262421;`;
const HR = `border:0;border-top:1px solid #d9d2c7;margin:32px 0;`;

function blockToHtml(b: PostBlock): string {
  switch (b.type) {
    case "paragraph":
      return `<p style="${P}">${renderInlineHtml(b.text)}</p>`;
    case "heading":
      return b.level === 3
        ? `<h3 style="${H3}">${esc(b.text)}</h3>`
        : `<h2 style="${H2}">${esc(b.text)}</h2>`;
    case "quote":
      return `<blockquote style="${QUOTE}">${renderInlineHtml(b.text)}${
        b.cite ? `<cite style="${CITE}">— ${esc(b.cite)}</cite>` : ""
      }</blockquote>`;
    case "pull-quote":
      return `<div style="${PULL}">${renderInlineHtml(b.text)}${
        b.cite ? `<div style="${CITE};text-align:center;margin-top:10px;">— ${esc(b.cite)}</div>` : ""
      }</div>`;
    case "image":
      return `<figure style="margin:0;"><img src="${esc(b.src)}" alt="${esc(b.alt ?? "")}" style="${IMG}" />${
        b.caption ? `<figcaption style="${CAPTION}">${esc(b.caption)}</figcaption>` : ""
      }</figure>`;
    case "image-text": {
      const img = `<img src="${esc(b.src)}" alt="${esc(b.alt ?? "")}" style="${IMG}" />${
        b.caption ? `<div style="${CAPTION}">${esc(b.caption)}</div>` : ""
      }`;
      const paras = b.text
        .split(/\n\s*\n/)
        .map((p) => `<p style="${P}">${renderInlineHtml(p)}</p>`)
        .join("");
      return `<div style="margin:24px 0;">${img}${paras}</div>`;
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
};

/** Build the inner blog content as email-safe HTML. No outer template chrome. */
export function buildBlogEmailHtml(post: EmailHtmlPost): string {
  const blocks = parseBlocks(post.blocks);
  const parts: string[] = [];

  if (post.excerpt && post.excerpt.trim()) {
    parts.push(
      `<p style="margin:0 0 24px 0;font-family:Georgia,serif;font-style:italic;font-size:18px;line-height:1.6;color:#4a443d;">${esc(post.excerpt.trim())}</p>`,
    );
  }

  if (blocks.length > 0) {
    // If a featured image exists and isn't already in blocks, add it up top
    // for hero layout (matches on-site rendering intent).
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

  return parts.filter(Boolean).join("\n");
}
