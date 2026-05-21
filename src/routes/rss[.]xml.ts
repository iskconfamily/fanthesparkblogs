import { createFileRoute } from "@tanstack/react-router";
import { getRequestHost, getRequestHeader } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { dbPostToPost, type DbBlogPost } from "@/lib/blog-adapter";
import { posts as staticPosts, type Post } from "@/content/posts";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateIso: string): string {
  const d = new Date(dateIso.length === 10 ? dateIso + "T00:00:00Z" : dateIso);
  return d.toUTCString();
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
            return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${toRfc822(p.date)}</pubDate>
      <category>${escapeXml(p.category)}</category>
      <description><![CDATA[${p.excerpt ?? ""}]]></description>
    </item>`;
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
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
