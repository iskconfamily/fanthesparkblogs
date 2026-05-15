import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { ArticleBody } from "@/components/article-body";
import { InlineNewsletter } from "@/components/inline-newsletter";
import { RelatedArticles } from "@/components/related-articles";
import { getPostBySlug, getRelated, formatDate } from "@/content/queries";

export const Route = createFileRoute("/post/$slug")({
  head: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) {
      return { meta: [{ title: "Not found — The Marginalia" }] };
    }
    return {
      meta: [
        { title: `${post.title} — The Marginalia` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:image", content: post.featuredImage.src },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: post.featuredImage.src },
      ],
    };
  },
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post, related: getRelated(post) };
  },
  component: PostPage,
  notFoundComponent: () => (
    <SiteLayout>
      <h1 className="text-4xl italic mb-4" style={{ fontFamily: "var(--font-serif-display)" }}>
        Essay not found
      </h1>
      <p className="text-muted-foreground">
        That essay doesn't seem to exist. <Link to="/archive">Return to the archive</Link>.
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

function PostPage() {
  const { post, related } = Route.useLoaderData();
  return (
    <SiteLayout>
      <article>
        <Link
          to="/tag/$slug"
          params={{ slug: post.category.toLowerCase() }}
          className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
          style={{ fontFamily: "var(--font-meta)", borderBottom: "none" }}
        >
          {post.category}
        </Link>
        <h1
          className="mt-3 text-4xl md:text-5xl italic leading-[1.1]"
          style={{ fontFamily: "var(--font-serif-display)" }}
        >
          {post.title}
        </h1>
        {post.subtitle && (
          <p
            className="mt-4 text-xl italic text-muted-foreground leading-snug"
            style={{ fontFamily: "var(--font-serif-display)" }}
          >
            {post.subtitle}
          </p>
        )}
        <p
          className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          {formatDate(post.date)}
        </p>
        <figure className="my-8">
          <img src={post.featuredImage.src} alt={post.featuredImage.alt} className="w-full" />
          {post.featuredImage.caption && (
            <figcaption
              className="mt-2 text-sm italic text-muted-foreground text-center"
              style={{ fontFamily: "var(--font-serif-display)" }}
            >
              {post.featuredImage.caption}
            </figcaption>
          )}
        </figure>
        <ArticleBody blocks={post.body} />
        <InlineNewsletter />
        <RelatedArticles posts={related} />
      </article>
    </SiteLayout>
  );
}
