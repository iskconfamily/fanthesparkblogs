import { Link } from "@tanstack/react-router";
import type { Post } from "@/content/posts";
import { PostArticle } from "@/components/post-article";

export function PostPreview({ post }: { post: Post }) {
  return (
    <article className="border-b border-border pb-16 mb-16 last:border-b-0">
      <PostArticle
        post={post}
        as="h2"
        titleClassName="text-3xl md:text-4xl"
        titleLink={{ slug: post.slug }}
      />
      <p className="mt-10">
        <Link
          to="/post/$slug"
          params={{ slug: post.slug }}
          className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-primary"
          style={{ fontFamily: "var(--font-meta)", borderBottom: "none" }}
        >
          Permalink
        </Link>
      </p>
    </article>
  );
}
