import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { getAllPosts, formatDate } from "@/content/queries";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "Archive — sravaṇādi jala" },
      { name: "description", content: "The full chronological archive of essays." },
      { property: "og:title", content: "Archive — sravaṇādi jala" },
      { property: "og:description", content: "Every essay, in order of arrival." },
    ],
  }),
  component: ArchivePage,
});

function ArchivePage() {
  const posts = getAllPosts();
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
