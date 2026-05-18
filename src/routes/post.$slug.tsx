import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { ArticleBody } from "@/components/article-body";
import { InlineNewsletter } from "@/components/inline-newsletter";
import { RelatedArticles } from "@/components/related-articles";
import { Byline } from "@/components/byline";
import { getPostBySlug, getRelated, formatDate, getAllPosts } from "@/content/queries";
import { getPublishedDbPostBySlug } from "@/lib/blog.functions";
import type { Post } from "@/content/posts";

export const Route = createFileRoute("/post/$slug")({
  head: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) return { meta: [{ title: "Essay — Fan The Spark" }] };
    return {
      meta: [
        { title: `${post.title} — Fan The Spark` },
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
  loader: async ({ params }) => {
    const dbPost = await getPublishedDbPostBySlug({ data: { slug: params.slug } });
    const post: Post | undefined = dbPost ?? getPostBySlug(params.slug);
    if (!post) throw notFound();
    const related = getRelated(post).length
      ? getRelated(post)
      : getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3);
    return { post, related };
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
        <div
          className="mb-8 px-5 py-5 md:px-7 md:py-6"
          style={{
            backgroundColor: "#faf2e4",
            borderRadius: "3px",
            borderTop: "1px solid rgba(217, 167, 78, 0.35)",
          }}
        >
          <h1
            className="text-4xl md:text-5xl italic leading-[1.1]"
            style={{ fontFamily: "var(--font-serif-display)", color: "#7e6c2a" }}
          >
            {post.title}
          </h1>
          <p
            className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground"
            style={{ fontFamily: "var(--font-meta)" }}
          >
            {formatDate(post.date)}
          </p>
        </div>
        <Byline author={post.author} />
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
