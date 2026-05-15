import type { ArticleBlock } from "@/content/posts";

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div
      className="prose-literary text-[19px] leading-[1.8] text-foreground"
      style={{ fontFamily: "var(--font-serif-body)" }}
    >
      {blocks.map((b, i) => {
        if (b.type === "p") return <p key={i}>{b.text}</p>;
        if (b.type === "h2")
          return (
            <h2
              key={i}
              className="mt-12 mb-6 text-3xl italic"
              style={{ fontFamily: "var(--font-serif-display)" }}
            >
              {b.text}
            </h2>
          );
        if (b.type === "quote")
          return (
            <blockquote
              key={i}
              className="my-10 border-l-2 border-primary pl-6 italic text-2xl leading-[1.5] text-foreground/85"
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
        if (b.type === "figure")
          return (
            <figure key={i} className="my-10">
              <img src={b.src} alt={b.alt} className="w-full" />
              {b.caption && (
                <figcaption
                  className="mt-2 text-sm italic text-muted-foreground text-center"
                  style={{ fontFamily: "var(--font-serif-display)" }}
                >
                  {b.caption}
                </figcaption>
              )}
            </figure>
          );
        return null;
      })}
    </div>
  );
}
