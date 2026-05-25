import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site-layout";
import { getPublishedDbPosts } from "@/lib/blog.functions";
import { mergePosts } from "@/lib/merge-posts";
import { formatDate } from "@/content/queries";
import type { Post } from "@/content/posts";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog (v1 editorial) — Fan The Spark" },
      { name: "description", content: "Experimental editorial magazine layout." },
    ],
  }),
  loader: () => getPublishedDbPosts(),
  component: BlogIndex,
});

function Card({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="block group no-underline"
      style={{ borderBottom: "none" }}
    >
      <div className={`overflow-hidden mb-4 ${large ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <img
          src={post.featuredImage.src}
          alt={post.featuredImage.alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p
        className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        {post.category} · {formatDate(post.date)}
      </p>
      <h3
        className={`italic leading-tight group-hover:text-primary transition-colors ${large ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}
        style={{ fontFamily: "var(--font-serif-display)", fontWeight: 500 }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-3 text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
      )}
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
  const [featured, ...rest] = posts;

  return (
    <SiteLayout>
      <div className="mb-16">
        <p
          className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          Editorial
        </p>
        <h1
          className="text-4xl md:text-6xl italic mb-3"
          style={{ fontFamily: "var(--font-serif-display)", fontWeight: 500 }}
        >
          The Blog
        </h1>
      </div>
      {featured && (
        <div className="mb-20 pb-20 border-b border-border">
          <Card post={featured} large />
        </div>
      )}
      <div className="grid gap-12 sm:grid-cols-2">
        {rest.map((p) => (
          <Card key={p.slug} post={p} />
        ))}
      </div>
    </SiteLayout>
  );
}
