import { Link } from "@tanstack/react-router";
import type { Post } from "@/content/posts";
import { tagSlug } from "@/content/posts";
import { formatDate } from "@/content/queries";
import { ArticleBody } from "@/components/article-body";

export function PostPreview({ post }: { post: Post }) {
  const layout = post.imageLayout ?? "hero";

  return (
    <article className="border-b border-border pb-16 mb-16 last:border-b-0">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {post.tags.map((t) => (
          <Link
            key={t}
            to="/tag/$slug"
            params={{ slug: tagSlug(t) }}
            className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-primary"
            style={{ fontFamily: "var(--font-meta)", borderBottom: "none" }}
          >
            {t}
          </Link>
        ))}
      </div>
      <h2 className="mt-2 mb-2">
        <Link
          to="/post/$slug"
          params={{ slug: post.slug }}
          className="text-3xl md:text-4xl italic text-foreground hover:text-primary"
          style={{
            fontFamily: "var(--font-serif-display)",
            fontWeight: 500,
            borderBottom: "none",
            display: "inline-block",
            lineHeight: 1.15,
          }}
        >
          {post.title}
        </Link>
      </h2>
      {post.subtitle && (
        <p
          className="mt-2 text-lg italic text-muted-foreground leading-snug"
          style={{ fontFamily: "var(--font-serif-display)" }}
        >
          {post.subtitle}
        </p>
      )}
      <p
        className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-3 mb-6"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        {formatDate(post.date)}
      </p>

      {layout === "hero" && (
        <figure className="mb-6">
          <img src={post.featuredImage.src} alt={post.featuredImage.alt} className="w-full" loading="lazy" />
          {post.featuredImage.caption && (
            <figcaption
              className="mt-2 text-sm italic text-muted-foreground text-center"
              style={{ fontFamily: "var(--font-serif-display)" }}
            >
              {post.featuredImage.caption}
            </figcaption>
          )}
        </figure>
      )}

      {layout === "side" ? (
        <div className="md:flex md:gap-6">
          <figure className="md:w-[260px] md:flex-shrink-0 mb-4 md:mb-0 md:float-none">
            <img src={post.featuredImage.src} alt={post.featuredImage.alt} className="w-full" loading="lazy" />
            {post.featuredImage.caption && (
              <figcaption
                className="mt-2 text-xs italic text-muted-foreground"
                style={{ fontFamily: "var(--font-serif-display)" }}
              >
                {post.featuredImage.caption}
              </figcaption>
            )}
          </figure>
          <div className="min-w-0 flex-1">
            <ArticleBody blocks={post.body} />
          </div>
        </div>
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
          Permalink ·  Share
        </Link>
      </p>
    </article>
  );
}
