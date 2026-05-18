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

export type PostArticleProps = {
  post: Post;
  as?: "h1" | "h2";
  titleClassName?: string;
  titleLink?: { slug: string };
};

export function PostArticle({
  post,
  as = "h1",
  titleClassName = "text-4xl md:text-5xl",
  titleLink,
}: PostArticleProps) {
  const layout = post.imageLayout ?? "hero";
  const [first, ...rest] = post.body as ArticleBlock[];
  const HeadingTag = as;

  const titleStyle = {
    fontFamily: "var(--font-serif-display)",
    color: "var(--brand-title-color)",
    fontWeight: 500 as const,
    lineHeight: 1.15,
  };

  const titleNode = titleLink ? (
    <Link
      to="/post/$slug"
      params={{ slug: titleLink.slug }}
      className={`${titleClassName} italic hover:text-primary`}
      style={{ ...titleStyle, borderBottom: "none", display: "inline-block" }}
    >
      {post.title}
    </Link>
  ) : (
    <span className={`${titleClassName} italic`} style={titleStyle}>
      {post.title}
    </span>
  );

  return (
    <>
      <div className="mb-3 max-w-[560px]">
        <HeadingTag className="mb-1">{titleNode}</HeadingTag>
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
    </>
  );
}
