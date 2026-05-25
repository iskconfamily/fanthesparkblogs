import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPublishedDbPosts } from "@/lib/blog.functions";
import { mergePosts } from "@/lib/merge-posts";
import { formatDate } from "@/content/queries";
import type { Post } from "@/content/posts";

export const Route = createFileRoute("/blog3")({
  head: () => ({
    meta: [
      { title: "Blog (v3 bento) — Fan The Spark" },
      { name: "description", content: "Experimental bento grid layout." },
    ],
  }),
  loader: () => getPublishedDbPosts(),
  component: BlogIndex,
});

function Tile({
  post,
  className = "",
  size = "md",
}: {
  post: Post;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const titleSize =
    size === "lg" ? "text-2xl md:text-3xl" : size === "sm" ? "text-base" : "text-lg md:text-xl";
  return (
    <Link
      to="/blog3/$slug"
      params={{ slug: post.slug }}
      className={`relative block overflow-hidden rounded-xl group no-underline border border-border ${className}`}
      style={{ borderBottom: undefined }}
    >
      <img
        src={post.featuredImage.src}
        alt={post.featuredImage.alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-5 text-white">
        <span
          className="inline-block self-start text-[10px] uppercase tracking-[0.22em] px-2 py-1 rounded-full bg-white/15 backdrop-blur mb-3"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          {post.category}
        </span>
        <h3
          className={`italic leading-tight ${titleSize}`}
          style={{ fontFamily: "var(--font-serif-display)", fontWeight: 500 }}
        >
          {post.title}
        </h3>
        <p
          className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/70"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          {formatDate(post.date)}
        </p>
      </div>
    </Link>
  );
}

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
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <header className="mb-12">
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3"
            style={{ fontFamily: "var(--font-meta)" }}
          >
            Bento · v3
          </p>
          <h1
            className="text-4xl md:text-6xl italic"
            style={{ fontFamily: "var(--font-serif-display)", fontWeight: 500 }}
          >
            Explore
          </h1>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-4">
          {posts.map((p, i) => {
            const pattern = i % 6;
            // Mix of sizes
            const spans =
              pattern === 0
                ? "col-span-2 row-span-2"
                : pattern === 3
                ? "col-span-2 row-span-1"
                : "col-span-1 row-span-1";
            const size: "sm" | "md" | "lg" = pattern === 0 ? "lg" : "md";
            return <Tile key={p.slug} post={p} className={spans} size={size} />;
          })}
        </div>
      </div>
    </main>
  );
}
