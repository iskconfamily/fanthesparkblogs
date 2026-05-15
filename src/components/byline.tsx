export function Byline({ author = "Vaisesika Dasa" }: { author?: string }) {
  return (
    <div className="my-6">
      <div className="h-px w-full bg-border" />
      <p
        className="mt-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground"
        style={{ fontFamily: "var(--font-meta)", fontWeight: 600 }}
      >
        By {author}
      </p>
    </div>
  );
}
