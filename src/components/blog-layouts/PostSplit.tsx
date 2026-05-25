import { Link } from "@tanstack/react-router";
import type { Post } from "@/content/posts";
import { formatDate } from "@/content/queries";
import { ArticleBody } from "@/components/article-body";
import type { PostBlock } from "@/lib/post-blocks";

export function PostSplit({ post }: { post: Post }) {
  const blocks: PostBlock[] = post.blocks && post.blocks.length ? post.blocks : [];

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12">
      <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-12 lg:self-start">
          <Link
            to="/blog3"
            className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-primary"
            style={{ fontFamily: "var(--font-meta)", borderBottom: "none" }}
          >
            ← All posts
          </Link>
          <p
            className="mt-8 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
            style={{ fontFamily: "var(--font-meta)" }}
          >
            Published
          </p>
          <p className="mt-1 text-sm">{formatDate(post.date)}</p>

          {post.author && (
            <>
              <p
                className="mt-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                style={{ fontFamily: "var(--font-meta)" }}
              >
                Author
              </p>
              <p className="mt-1 text-sm">{post.author}</p>
            </>
          )}

          <p
            className="mt-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
            style={{ fontFamily: "var(--font-meta)" }}
          >
            Category
          </p>
          <p className="mt-1 text-sm">{post.category}</p>

          {post.tags.length > 0 && (
            <>
              <p
                className="mt-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                style={{ fontFamily: "var(--font-meta)" }}
              >
                Tags
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-1 border border-border rounded-full text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </aside>

        <article>
          <h1
            className="text-4xl md:text-5xl italic leading-tight mb-8"
            style={{ fontFamily: "var(--font-serif-display)", fontWeight: 500 }}
          >
            {post.title}
          </h1>
          {post.featuredImage?.src && (
            <img
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              className="w-full aspect-[16/9] object-cover mb-10 rounded-lg"
            />
          )}
          <ArticleBody blocks={blocks} />
        </article>
      </div>
    </div>
  );
}
