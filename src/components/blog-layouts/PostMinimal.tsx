import { Link } from "@tanstack/react-router";
import type { Post } from "@/content/posts";
import { formatDate } from "@/content/queries";
import { ArticleBody } from "@/components/article-body";
import { postToBlocks } from "@/lib/post-to-blocks";
import vaisesikaPortrait from "@/assets/vaisesika-portrait.jpg";

export function PostMinimal({ post, bare = false }: { post: Post; bare?: boolean }) {
  const blocks = postToBlocks(post);
  const author = post.author ?? "Vaisesika Dasa";

  const article = (
    <article className={`post-minimal-card mx-auto ${bare ? "" : "max-w-[960px]"} px-5 md:px-16 py-12 md:py-16`}>
        <p className="post-minimal-eyebrow mb-6">{post.category}</p>

        <h1 className="post-minimal-title text-3xl md:text-6xl mb-6">
          {post.title}
        </h1>

        <div className="mb-12 flex items-center gap-3">
          <img
            src={vaisesikaPortrait}
            alt={author}
            loading="lazy"
            className="h-10 w-10 rounded-full object-cover"
          />
          <p className="post-minimal-byline">
            By {author} <span className="mx-2 opacity-60">•</span> {formatDate(post.date)}
          </p>
        </div>

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
  );

  if (bare) return article;

  return <div className="post-minimal-page py-10 md:py-16">{article}</div>;
}

