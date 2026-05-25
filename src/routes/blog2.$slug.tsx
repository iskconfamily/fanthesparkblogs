import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PostMinimal } from "@/components/blog-layouts/PostMinimal";
import { getPostBySlug } from "@/content/queries";
import { getPublishedDbPostBySlug } from "@/lib/blog.functions";
import type { Post } from "@/content/posts";

export const Route = createFileRoute("/blog2/$slug")({
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
    return { post };
  },
  component: PostPage,
  notFoundComponent: () => (
    <main className="mx-auto max-w-[640px] px-6 py-20">
      <h1 className="text-3xl italic mb-4" style={{ fontFamily: "var(--font-serif-display)" }}>
        Not found
      </h1>
      <Link to="/blog2" className="text-muted-foreground">
        ← Back
      </Link>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-[640px] px-6 py-20">
      <h1 className="text-3xl italic" style={{ fontFamily: "var(--font-serif-display)" }}>
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-3">{error.message}</p>
    </main>
  ),
});

function PostPage() {
  const { post } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PostMinimal post={post} />
    </div>
  );
}
