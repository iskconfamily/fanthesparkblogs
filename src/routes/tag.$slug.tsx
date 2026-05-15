import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { PostPreview } from "@/components/post-preview";
import { getPostsByTag } from "@/content/queries";

export const Route = createFileRoute("/tag/$slug")({
  head: ({ params }) => {
    const label = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
    return {
      meta: [
        { title: `${label} — The Marginalia` },
        { name: "description", content: `Essays tagged ${label}.` },
        { property: "og:title", content: `${label} — The Marginalia` },
        { property: "og:description", content: `A small archive of essays on ${label.toLowerCase()}.` },
      ],
    };
  },
  loader: ({ params }) => {
    const posts = getPostsByTag(params.slug);
    if (!posts.length) throw notFound();
    return { posts, slug: params.slug };
  },
  component: TagPage,
  notFoundComponent: () => (
    <SiteLayout>
      <h1 className="text-4xl italic mb-4" style={{ fontFamily: "var(--font-serif-display)" }}>
        Nothing here yet
      </h1>
      <p className="text-muted-foreground">
        We have not yet published anything under this tag.{" "}
        <Link to="/archive">Browse the archive</Link>.
      </p>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <h1 className="text-3xl italic" style={{ fontFamily: "var(--font-serif-display)" }}>
        Something went quietly wrong
      </h1>
      <p className="text-muted-foreground mt-3">{error.message}</p>
    </SiteLayout>
  ),
});

function TagPage() {
  const { posts, slug } = Route.useLoaderData();
  const label = slug.charAt(0).toUpperCase() + slug.slice(1);
  return (
    <SiteLayout>
      <p
        className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        Category
      </p>
      <h1 className="text-5xl italic mb-3" style={{ fontFamily: "var(--font-serif-display)" }}>
        {label}
      </h1>
      <p className="text-muted-foreground italic mb-12">
        A small archive of essays gathered under {label.toLowerCase()}.
      </p>
      {posts.map((p: typeof posts[number]) => (
        <PostPreview key={p.slug} post={p} />
      ))}
    </SiteLayout>
  );
}
