import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { PostPreview } from "@/components/post-preview";
import { getPostsByTag } from "@/content/queries";
import { tagFromSlug } from "@/content/posts";

export const Route = createFileRoute("/tag/$slug")({
  head: ({ params }) => {
    const label = tagFromSlug(params.slug) ?? params.slug;
    return {
      meta: [
        { title: `${label} — Fan The Spark` },
        { name: "description", content: `Essays gathered under ${label}.` },
        { property: "og:title", content: `${label} — Fan The Spark` },
        { property: "og:description", content: `A small archive of essays on ${label.toLowerCase()}.` },
      ],
    };
  },
  loader: ({ params }) => {
    const posts = getPostsByTag(params.slug);
    const label = tagFromSlug(params.slug);
    if (!label) throw notFound();
    return { posts, label };
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
  const { posts, label } = Route.useLoaderData();
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
        A small gathering of essays under {label.toLowerCase()}.
      </p>
      {posts.length === 0 ? (
        <p className="text-muted-foreground italic">
          Nothing here yet — this category is waiting for its first essay.{" "}
          <Link to="/archive">Browse the archive</Link>.
        </p>
      ) : (
        posts.map((p: import("@/content/posts").Post) => <PostPreview key={p.slug} post={p} />)
      )}
    </SiteLayout>
  );
}
