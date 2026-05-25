import { Link } from "@tanstack/react-router";
import type { Post } from "@/content/posts";
import { formatDate } from "@/content/queries";
import { ArticleBody } from "@/components/article-body";
import { Byline } from "@/components/byline";
import type { PostBlock } from "@/lib/post-blocks";

export function PostMinimal({ post }: { post: Post }) {
  const blocks: PostBlock[] =
    post.blocks && post.blocks.length
      ? post.blocks
      : post.body
          .filter((b) => b.type === "p" || b.type === "h2" || b.type === "quote")
          .map((b, i) =>
            b.type === "p"
              ? { id: `m-p-${i}`, type: "paragraph" as const, text: b.text }
              : b.type === "h2"
              ? { id: `m-h-${i}`, type: "heading" as const, level: 2 as const, text: b.text }
              : { id: `m-q-${i}`, type: "quote" as const, text: b.text, cite: b.cite },
          );

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
