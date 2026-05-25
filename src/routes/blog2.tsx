import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPublishedDbPosts } from "@/lib/blog.functions";
import { mergePosts } from "@/lib/merge-posts";
import { formatDate } from "@/content/queries";

export const Route = createFileRoute("/blog2")({
  head: () => ({
    meta: [
      { title: "Blog (v2 minimal) — Fan The Spark" },
      { name: "description", content: "Experimental minimal reader layout." },
    ],
  }),
  loader: () => getPublishedDbPosts(),
  component: BlogIndex,
});

function BlogIndex() {
  const initial = Route.useLoaderData();
  const fetchPosts = useServerFn(getPublishedDbPosts);
  const { data: dbPosts = initial } = useQuery({
    queryKey: ["published-posts"],
    queryFn: () => fetchPosts(),
    initialData: initial,
  });
  const posts = mergePosts(dbPosts);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[640px] px-6 py-20">
        <header className="mb-16">
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3"
            style={{ fontFamily: "var(--font-meta)" }}
          >
            Reader · v2
          </p>
          <h1
            className="text-3xl md:text-4xl"
            style={{ fontFamily: "var(--font-serif-display)", fontWeight: 500 }}
          >
            Essays
          </h1>
        </header>

        <ul className="divide-y divide-border">
          {posts.map((p) => (
            <li key={p.slug} className="py-8">
              <Link
                to="/blog2/$slug"
                params={{ slug: p.slug }}
                className="block no-underline group"
                style={{ borderBottom: "none" }}
              >
                <p
                  className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2"
                  style={{ fontFamily: "var(--font-meta)" }}
                >
                  {formatDate(p.date)}
                </p>
                <h2
                  className="text-xl md:text-2xl mb-2 group-hover:text-primary transition-colors"
                  style={{ fontFamily: "var(--font-serif-display)", fontWeight: 500 }}
                >
                  {p.title}
                </h2>
                {p.excerpt && (
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {p.excerpt}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
