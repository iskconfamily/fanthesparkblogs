import vaisesikaPortrait from "@/assets/vaisesika-portrait.png";

export function Byline({
  author = "Vaisesika Dasa",
  date,
}: {
  author?: string;
  date?: string;
}) {
  return (
    <div className="my-6">
      <div className="h-px w-full bg-border" />
      <div className="mt-3 flex items-center gap-3">
        <img
          src={vaisesikaPortrait}
          alt={author}
          className="h-10 w-10 rounded-full object-cover"
          loading="lazy"
        />
        <p
          className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground"
          style={{ fontFamily: "var(--font-meta)", fontWeight: 600 }}
        >
          <span className="text-foreground">{author}</span>
          {date ? <span className="mx-2 opacity-50">·</span> : null}
          {date ? <span>{date}</span> : null}
        </p>
      </div>
    </div>
  );
}
