import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site-layout";
import { getAllPosts, formatDate } from "@/content/queries";
import { getPublishedDbPosts } from "@/lib/blog.functions";
import type { Post } from "@/content/posts";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "Archive — sravaṇādi jala" },
      { name: "description", content: "The full chronological archive of essays." },
      { property: "og:title", content: "Archive — sravaṇādi jala" },
      { property: "og:description", content: "Every essay, in order of arrival." },
    ],
  }),
  loader: () => getPublishedDbPosts(),
  component: ArchivePage,
});

function ArchivePage() {
  const initial = Route.useLoaderData();
  const fetchPosts = useServerFn(getPublishedDbPosts);
  const { data: dbPosts = initial } = useQuery({
    queryKey: ["published-posts"],
    queryFn: () => fetchPosts(),
    initialData: initial,
  });
  const dbSlugs = new Set(dbPosts.map((p: Post) => p.slug));
  const posts = [...dbPosts, ...getAllPosts().filter((p) => !dbSlugs.has(p.slug))].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  return (
    <SiteLayout>
      <p
        className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        The complete archive
      </p>
      <h1 className="text-5xl italic mb-3" style={{ fontFamily: "var(--font-serif-display)" }}>
        Archive
      </h1>
      <p className="text-muted-foreground mb-10 italic">Every essay, in order of arrival.</p>
      <ul className="space-y-6">
        {posts.map((p) => (
          <li key={p.slug} className="border-b border-border pb-5">
            <p
              className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-1"
              style={{ fontFamily: "var(--font-meta)" }}
            >
              {formatDate(p.date)} · {p.category}
            </p>
            <Link
              to="/post/$slug"
              params={{ slug: p.slug }}
              className="text-2xl italic"
              style={{ fontFamily: "var(--font-serif-display)", borderBottom: "none" }}
            >
              {p.title}
            </Link>
            <p className="text-sm text-muted-foreground mt-1">{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </SiteLayout>
  );
}
