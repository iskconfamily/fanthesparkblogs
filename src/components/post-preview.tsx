import { Link } from "@tanstack/react-router";
import type { Post, ArticleBlock } from "@/content/posts";
import { formatDate } from "@/content/queries";
import { ArticleBody } from "@/components/article-body";
import { Byline } from "@/components/byline";

function Figure({
  post,
  className,
  captionAlign = "center",
}: {
  post: Post;
  className?: string;
  captionAlign?: "center" | "left";
}) {
  return (
    <figure className={className}>
      <img src={post.featuredImage.src} alt={post.featuredImage.alt} className="w-full" loading="lazy" />
      {post.featuredImage.caption && (
        <figcaption
          className={`mt-2 text-sm italic text-muted-foreground ${captionAlign === "center" ? "text-center" : ""}`}
          style={{ fontFamily: "var(--font-serif-display)" }}
        >
          {post.featuredImage.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function PostPreview({ post }: { post: Post }) {
  const layout = post.imageLayout ?? "hero";
  const [first, ...rest] = post.body as ArticleBlock[];

  return (
    <article className="border-b border-border pb-16 mb-16 last:border-b-0">
      <div
        className="mb-8 px-5 py-4 md:px-6 md:py-5"
        style={{
          backgroundColor: "#faf2e4",
          borderRadius: "3px",
          borderTop: "1px solid rgba(217, 167, 78, 0.35)",
        }}
      >
        <h2 className="mb-2">
          <Link
            to="/post/$slug"
            params={{ slug: post.slug }}
            className="text-3xl md:text-4xl italic hover:text-primary"
            style={{
              fontFamily: "var(--font-serif-display)",
              fontWeight: 500,
              borderBottom: "none",
              display: "inline-block",
              lineHeight: 1.15,
              color: "#7e6c2a",
            }}
          >
            {post.title}
          </Link>
        </h2>
        <p
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          {formatDate(post.date)}
        </p>
      </div>
      <Byline author={post.author} />

      {layout === "side" ? (
        <div>
          <Figure
            post={post}
            captionAlign="left"
            className="float-right ml-6 mb-3 w-[44%] max-w-[280px]"
          />
          <ArticleBody blocks={post.body} />
          <div className="clear-both" />
        </div>
      ) : layout === "hero" ? (
        <>
          {first && <ArticleBody blocks={[first]} />}
          <Figure post={post} className="my-8" />
          {rest.length > 0 && <ArticleBody blocks={rest} />}
        </>
      ) : (
        <ArticleBody blocks={post.body} />
      )}

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
