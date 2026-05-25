import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { PostArticle } from "@/components/post-article";
import { RelatedArticles } from "@/components/related-articles";
import { getPostBySlug, getRelated, getAllPosts } from "@/content/queries";
import { getPublishedDbPostBySlug } from "@/lib/blog.functions";
import type { Post } from "@/content/posts";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = getPostBySlug(params.slug);
    return {
      meta: [
        { title: post ? `${post.title} — Fan The Spark` : "Essay — Fan The Spark" },
        ...(post ? [{ name: "description", content: post.excerpt }] : []),
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
        <Link to="/blog">Return to the blog</Link>.
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
        <RelatedArticles posts={related} />
      </article>
    </SiteLayout>
  );
}
