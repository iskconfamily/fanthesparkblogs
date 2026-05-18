import type { PostBlock } from "@/lib/post-blocks";
import { renderInline } from "@/lib/markdown-inline";
import { InlineNewsletter } from "@/components/inline-newsletter";

function ImageBlock({ b }: { b: Extract<PostBlock, { type: "image" }> }) {
  const alt = b.alt ?? "";
  const isSignature =
    /\/signature/i.test(b.src) || /^signature/i.test(alt);

  if (isSignature) {
    return (
      <figure className="my-6 max-w-[180px] clear-both">
        <img src={b.src} alt={alt} className="w-full" loading="lazy" />
      </figure>
    );
  }

  const layout = b.layout ?? "hero";

  const cls =
    layout === "side-right"
      ? "float-right ml-6 mb-3 w-[44%] max-w-[280px]"
      : layout === "side-left"
        ? "float-left mr-6 mb-3 w-[44%] max-w-[280px]"
        : layout === "inline-small"
          ? "mx-auto my-8 w-[60%]"
          : "my-8 w-full";

  const captionAlign = layout === "side-right" || layout === "side-left" ? "text-left" : "text-center";

  return (
    <figure className={cls}>
      <img src={b.src} alt={alt} className="w-full" loading="lazy" />
      {b.caption && (
        <figcaption
          className={`mt-2 text-sm italic text-muted-foreground ${captionAlign}`}
          style={{ fontFamily: "var(--font-serif-display)" }}
        >
          {b.caption}
        </figcaption>
      )}
    </figure>
  );
}

function ImageTextBlock({ b }: { b: Extract<PostBlock, { type: "image-text" }> }) {
  const imageSide = b.imageSide ?? "right";
  return (
    <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start clear-both">
      <figure className={imageSide === "left" ? "md:order-1" : "md:order-2"}>
        <img src={b.src} alt={b.alt ?? ""} className="w-full" loading="lazy" />
        {b.caption && (
          <figcaption
            className="mt-2 text-sm italic text-muted-foreground"
            style={{ fontFamily: "var(--font-serif-display)" }}
          >
            {b.caption}
          </figcaption>
        )}
      </figure>
      <div className={imageSide === "left" ? "md:order-2" : "md:order-1"}>
        {b.text.split(/\n\s*\n/).map((para, i) => (
          <p key={i} className="mb-4 last:mb-0">{renderInline(para)}</p>
        ))}
      </div>
    </div>
  );
}

function GalleryBlock({ b }: { b: Extract<PostBlock, { type: "gallery" }> }) {
  const cols = b.columns ?? 2;
  const gridCls = cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <div className={`my-10 grid grid-cols-1 ${gridCls} gap-4 clear-both`}>
      {b.images.map((img, i) => (
        <figure key={i}>
          <img src={img.src} alt={img.alt ?? ""} className="w-full" loading="lazy" />
          {img.caption && (
            <figcaption
              className="mt-2 text-xs italic text-muted-foreground text-center"
              style={{ fontFamily: "var(--font-serif-display)" }}
            >
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

export function ArticleBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div
      className="prose-literary text-[18px] leading-[1.75]"
      style={{ fontFamily: "var(--font-serif-body)" }}
    >
      {blocks.map((b) => {
        if (b.type === "paragraph") return <p key={b.id}>{renderInline(b.text)}</p>;
        if (b.type === "heading") {
          const Tag = (b.level === 3 ? "h3" : "h2") as "h2" | "h3";
          return (
            <Tag
              key={b.id}
              className="mt-12 mb-6 text-3xl italic clear-both"
              style={{ fontFamily: "var(--font-serif-display)" }}
            >
              {b.text}
            </Tag>
          );
        }
        if (b.type === "quote") {
          return (
            <blockquote
              key={b.id}
              className="my-10 border-l-2 border-primary pl-6 italic text-2xl leading-[1.5] text-foreground/85 clear-both"
              style={{ fontFamily: "var(--font-serif-display)" }}
            >
              <p className="mb-2">"{renderInline(b.text)}"</p>
              {b.cite && (
                <cite
                  className="block not-italic text-sm uppercase tracking-[0.18em] text-muted-foreground"
                  style={{ fontFamily: "var(--font-meta)" }}
                >
                  — {b.cite}
                </cite>
              )}
            </blockquote>
          );
        }
        if (b.type === "pull-quote") {
          return (
            <aside
              key={b.id}
              className="my-14 mx-auto max-w-[640px] text-center italic clear-both"
              style={{ fontFamily: "var(--font-serif-display)" }}
            >
              <p className="text-3xl md:text-4xl leading-[1.3] text-foreground/90">
                {renderInline(b.text)}
              </p>
              {b.cite && (
                <cite
                  className="mt-4 block not-italic text-xs uppercase tracking-[0.22em] text-muted-foreground"
                  style={{ fontFamily: "var(--font-meta)" }}
                >
                  — {b.cite}
                </cite>
              )}
            </aside>
          );
        }
        if (b.type === "image") return <ImageBlock key={b.id} b={b} />;
        if (b.type === "image-text") return <ImageTextBlock key={b.id} b={b} />;
        if (b.type === "gallery") return <GalleryBlock key={b.id} b={b} />;
        if (b.type === "divider") {
          return <hr key={b.id} className="my-12 border-border clear-both" />;
        }
        if (b.type === "callout") {
          return (
            <aside
              key={b.id}
              className="my-8 p-5 border-l-4 border-primary bg-muted/40 text-base clear-both"
            >
              {renderInline(b.text)}
            </aside>
          );
        }
        if (b.type === "newsletter-cta") {
          return (
            <div key={b.id} className="clear-both">
              <InlineNewsletter />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
