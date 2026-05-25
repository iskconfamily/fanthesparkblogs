import { Link } from "@tanstack/react-router";
import type { Post } from "@/content/posts";
import { formatDate } from "@/content/queries";
import { ArticleBody } from "@/components/article-body";
import { postToBlocks } from "@/lib/post-to-blocks";

export function PostMinimal({ post }: { post: Post }) {
  const blocks = postToBlocks(post);

  return (
    <div className="post-minimal-page py-10 md:py-16">
      <article className="post-minimal-card mx-auto max-w-[960px] px-6 md:px-16 py-12 md:py-16">
        <p className="post-minimal-eyebrow mb-6">{post.category}</p>

        <h1 className="post-minimal-title text-5xl md:text-6xl mb-6">
          {post.title}
        </h1>

        <p className="post-minimal-byline mb-12">
          By {post.author ?? "Vaisesika Dasa"} <span className="mx-2 opacity-60">•</span> {formatDate(post.date)}
        </p>

        <ArticleBody blocks={blocks} />

        <p
          className="mt-12 text-2xl italic"
          style={{ fontFamily: "var(--font-serif-display)", color: "#2a2418" }}
        >
          {post.author ?? "Vaisesika Dasa"}
        </p>

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
    </div>
  );
}
