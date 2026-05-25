import { Link } from "@tanstack/react-router";
import type { Post } from "@/content/posts";
import { formatDate } from "@/content/queries";
import { ArticleBody } from "@/components/article-body";
import { Byline } from "@/components/byline";
import { postToBlocks } from "@/lib/post-to-blocks";

export function PostMinimal({ post }: { post: Post }) {
  const blocks = postToBlocks(post);

  return (
    <article className="mx-auto max-w-[640px] px-6 py-16">
      <p
        className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        {formatDate(post.date)} · {post.category}
      </p>
      <h1
        className="text-3xl md:text-4xl mb-6 leading-tight"
        style={{ fontFamily: "var(--font-serif-display)", fontWeight: 500 }}
      >
        {post.title}
      </h1>
      <Byline author={post.author} date={formatDate(post.date)} />
      <div className="mt-10">
        <ArticleBody blocks={blocks} />
      </div>
      <div className="mt-16 pt-8 border-t border-border">
        <Link
          to="/blog2"
          className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-primary"
          style={{ fontFamily: "var(--font-meta)", borderBottom: "none" }}
        >
          ← Back to index
        </Link>
      </div>
    </article>
  );
}
