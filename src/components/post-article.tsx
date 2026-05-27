import { Link } from "@tanstack/react-router";
import type { Post, ArticleBlock } from "@/content/posts";
import type { PostBlock } from "@/lib/post-blocks";
import { formatDate } from "@/content/queries";
import { ArticleBody } from "@/components/article-body";
import { Byline } from "@/components/byline";

/**
 * Convert legacy `body` + `featuredImage` + `imageLayout` into a `PostBlock[]`
 * so the renderer only has one code path. New posts edited via the AI chat
 * designer skip this entirely.
 */
function legacyToBlocks(post: Post): PostBlock[] {
  const blocks: PostBlock[] = [];
  const layout = post.imageLayout ?? "hero";
  const featured = post.featuredImage;

  if (featured?.src && layout === "side") {
    blocks.push({
      id: "legacy-featured",
      type: "image",
      src: featured.src,
      alt: featured.alt,
      caption: featured.caption,
      layout: "side-right",
    });
  }

  let insertedHero = layout !== "hero" || !featured?.src;
  let firstPara = true;
  for (const b of post.body as ArticleBlock[]) {
    if (b.type === "p") {
      blocks.push({ id: `legacy-p-${blocks.length}`, type: "paragraph", text: b.text });
      if (!insertedHero && firstPara) {
        blocks.push({
          id: "legacy-featured",
          type: "image",
          src: featured.src,
          alt: featured.alt,
          caption: featured.caption,
          layout: "hero",
        });
        insertedHero = true;
      }
      firstPara = false;
    } else if (b.type === "h2") {
      blocks.push({ id: `legacy-h-${blocks.length}`, type: "heading", level: 2, text: b.text });
    } else if (b.type === "quote") {
      blocks.push({ id: `legacy-q-${blocks.length}`, type: "quote", text: b.text, cite: b.cite });
    } else if (b.type === "figure") {
      blocks.push({
        id: `legacy-f-${blocks.length}`,
        type: "image",
        src: b.src,
        alt: b.alt,
        caption: b.caption,
        layout: "full",
      });
    }
  }

  if (!insertedHero && featured?.src) {
    blocks.push({
      id: "legacy-featured",
      type: "image",
      src: featured.src,
      alt: featured.alt,
      caption: featured.caption,
      layout: "hero",
    });
  }

  return blocks;
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
  const blocks: PostBlock[] = post.blocks && post.blocks.length ? post.blocks : legacyToBlocks(post);
  const HeadingTag = as;

  const titleStyle = {
    fontFamily: "var(--font-serif-display)",
    color: "var(--brand-title-color)",
    fontWeight: 500 as const,
    lineHeight: 1.15,
  };

  const titleNode = titleLink ? (
    <Link
      to="/wisdom/blog/$slug"
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
      </div>
      <Byline author={post.author} date={formatDate(post.date)} />

      <ArticleBody blocks={blocks} />
      <div className="clear-both" />
    </>
  );

}
