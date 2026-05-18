import type { PostBlock } from "@/lib/post-blocks";

function ImageBlock({ b }: { b: Extract<PostBlock, { type: "image" }> }) {
  const alt = b.alt ?? "";
  const isSignature =
    /\/signature/i.test(b.src) || /^signature/i.test(alt);

  if (isSignature) {
    return (
      <figure className="my-6 max-w-[300px] clear-both">
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
          : "my-8 w-full"; // hero / full

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

export function ArticleBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div
      className="prose-literary text-[18px] leading-[1.75]"
      style={{ fontFamily: "var(--font-serif-body)" }}
    >
      {blocks.map((b) => {
        if (b.type === "paragraph") return <p key={b.id}>{b.text}</p>;
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
              <p className="mb-2">"{b.text}"</p>
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
        if (b.type === "image") return <ImageBlock key={b.id} b={b} />;
        if (b.type === "divider") {
          return <hr key={b.id} className="my-12 border-border clear-both" />;
        }
        if (b.type === "callout") {
          return (
            <aside
              key={b.id}
              className="my-8 p-5 border-l-4 border-primary bg-muted/40 text-base clear-both"
            >
              {b.text}
            </aside>
          );
        }
        return null;
      })}
    </div>
  );
}
