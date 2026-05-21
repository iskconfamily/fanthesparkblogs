import { createFileRoute } from "@tanstack/react-router";
import { getRequestHost, getRequestHeader } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { dbPostToPost, type DbBlogPost } from "@/lib/blog-adapter";
import { posts as staticPosts, type Post, type ArticleBlock } from "@/content/posts";
import type { PostBlock } from "@/lib/post-blocks";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toRfc822(dateIso: string): string {
  const d = new Date(dateIso.length === 10 ? dateIso + "T00:00:00Z" : dateIso);
  return d.toUTCString();
}

function inline(text: string): string {
  // Minimal inline markdown: **bold**, *italic*, [text](url)
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, u) => `<a href="${u}">${t}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return s;
}

function blocksToHtml(blocks: PostBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "paragraph":
          return `<p>${inline(b.text)}</p>`;
        case "heading": {
          const lvl = b.level === 3 ? 3 : 2;
          return `<h${lvl}>${inline(b.text)}</h${lvl}>`;
        }
        case "quote":
        case "pull-quote":
          return `<blockquote><p>${inline(b.text)}</p>${b.cite ? `<cite>${escapeHtml(b.cite)}</cite>` : ""}</blockquote>`;
        case "image":
          return `<figure><img src="${escapeHtml(b.src)}" alt="${escapeHtml(b.alt ?? "")}" />${b.caption ? `<figcaption>${escapeHtml(b.caption)}</figcaption>` : ""}</figure>`;
        case "image-text":
          return `<figure><img src="${escapeHtml(b.src)}" alt="${escapeHtml(b.alt ?? "")}" />${b.caption ? `<figcaption>${escapeHtml(b.caption)}</figcaption>` : ""}</figure><p>${inline(b.text)}</p>`;
        case "gallery":
          return b.images
            .map(
              (img) =>
                `<figure><img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt ?? "")}" />${img.caption ? `<figcaption>${escapeHtml(img.caption)}</figcaption>` : ""}</figure>`,
            )
            .join("");
        case "divider":
          return `<hr />`;
        case "callout":
          return `<aside><p>${inline(b.text)}</p></aside>`;
        case "newsletter-cta":
          return "";
        default:
          return "";
      }
    })
    .join("\n");
}

function bodyToHtml(body: ArticleBlock[]): string {
  return body
    .map((b) => {
      switch (b.type) {
        case "p":
          return `<p>${inline(b.text)}</p>`;
        case "h2":
          return `<h2>${inline(b.text)}</h2>`;
        case "quote":
          return `<blockquote><p>${inline(b.text)}</p>${b.cite ? `<cite>${escapeHtml(b.cite)}</cite>` : ""}</blockquote>`;
        case "figure":
          return `<figure><img src="${escapeHtml(b.src)}" alt="${escapeHtml(b.alt)}" />${b.caption ? `<figcaption>${escapeHtml(b.caption)}</figcaption>` : ""}</figure>`;
        default:
          return "";
      }
    })
    .join("\n");
}

function postToHtml(p: Post): string {
  if (p.blocks && p.blocks.length) return blocksToHtml(p.blocks);
  const parts: string[] = [];
  if (p.featuredImage?.src) {
    parts.push(
      `<figure><img src="${escapeHtml(p.featuredImage.src)}" alt="${escapeHtml(p.featuredImage.alt ?? "")}" />${p.featuredImage.caption ? `<figcaption>${escapeHtml(p.featuredImage.caption)}</figcaption>` : ""}</figure>`,
    );
  }
  parts.push(bodyToHtml(p.body));
  return parts.join("\n");
}

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const host = getRequestHost();
        const proto = getRequestHeader("x-forwarded-proto") ?? "https";
        const base = `${proto}://${host}`;

        let dbPosts: Post[] = [];
        try {
          const { data } = await supabaseAdmin
            .from("blog_posts")
            .select("*")
            .eq("status", "published")
            .order("published_at", { ascending: false });
          dbPosts = ((data as unknown as DbBlogPost[]) ?? []).map(dbPostToPost);
        } catch (e) {
          console.error("rss: db fetch failed", e);
        }

        const seen = new Set<string>();
        const all: Post[] = [];
        for (const p of [...dbPosts, ...staticPosts]) {
          if (seen.has(p.slug)) continue;
          seen.add(p.slug);
          all.push(p);
        }
        all.sort((a, b) => b.date.localeCompare(a.date));
        const items = all.slice(0, 50);

        const lastBuild = items[0]?.date ?? new Date().toISOString();

        const itemsXml = items
          .map((p) => {
            const link = `${base}/post/${p.slug}`;
            const fullHtml = postToHtml(p);
            return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${toRfc822(p.date)}</pubDate>
      <category>${escapeXml(p.category)}</category>
      <description><![CDATA[${p.excerpt ?? ""}]]></description>
      <content:encoded><![CDATA[${fullHtml}]]></content:encoded>
    </item>`;
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Fan The Spark</title>
    <link>${base}</link>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Long-form bhakti essays on hearing, chanting, and the practice of remembering Krishna.</description>
    <language>en-us</language>
    <lastBuildDate>${toRfc822(lastBuild)}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

        return new Response(xml, {
          status: 200,
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=600",
          },
        });
      },
    },
  },
});
