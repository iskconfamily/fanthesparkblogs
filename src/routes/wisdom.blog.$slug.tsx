import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { InlineNewsletter } from "@/components/inline-newsletter";
import { RelatedArticles } from "@/components/related-articles";
import { PostArticle } from "@/components/post-article";
import { getPostBySlug, getRelated, getAllPosts } from "@/content/queries";
import { getPublishedDbPostBySlug } from "@/lib/blog.functions";
import type { Post } from "@/content/posts";

export const Route = createFileRoute("/wisdom/blog/$slug")({
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
      links: [{ rel: "canonical", href: `https://fanthesparkblogs.lovable.app/post/${params.slug}` }],
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
        That essay doesn't seem to exist. <Link to="/wisdom/blog">Return to the blog</Link>.
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
        <PostArticle post={post} as="h1" titleClassName="text-4xl md:text-5xl" />
        <InlineNewsletter />
        <RelatedArticles posts={related} />
      </article>
    </SiteLayout>
  );
}
