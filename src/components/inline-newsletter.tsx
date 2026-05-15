export function InlineNewsletter() {
  return (
    <section className="mt-16 border-y border-border py-10 text-center">
      <p
        className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        Newsletter
      </p>
      <h3
        className="text-2xl italic mb-3"
        style={{ fontFamily: "var(--font-serif-display)" }}
      >
        Occasional letters, one or two a week.
      </h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
        A short note on books, attention, and the slow practice of being alive. Free, ad-free, unhurried.
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="your@email"
          className="flex-1 border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
          style={{ fontFamily: "var(--font-serif-body)" }}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-5 py-2 text-xs uppercase tracking-[0.18em] hover:opacity-90"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
