export const TESTIMONIALS: { quote: string; author: string }[] = [
  {
    quote:
      "Vaisesika Dasa is a treasure - if you ever have the opportunity to hear him, take it!",
    author: "Paul, Silicon Valley — USA",
  },
  {
    quote:
      "If your goal is towards 'simple living, high thinking', then, Vaisesika Dasa's talk covered it! Really simple real life examples and how we can implement them to eventually lead a calm and peaceful life. DE-CLUTTER!",
    author: "Rashmi, Silicon Valley — USA",
  },
  {
    quote:
      "The speaker and the topic was both timeless and timely. The audience was very tuned in to the topic. We need more of these!",
    author: "Anonymous",
  },
];

export function TestimonialsRow({ heading }: { heading?: string }) {
  return (
    <section className="my-12">
      {heading ? (
        <p
          className="mb-6 text-center"
          style={{
            fontFamily: "var(--font-meta)",
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--brand-olive, var(--muted-foreground))",
          }}
        >
          {heading}
        </p>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} className="flex flex-col">
            <blockquote
              style={{
                fontFamily: "var(--font-serif-body)",
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--foreground)",
              }}
            >
              {t.quote}
            </blockquote>
            <figcaption
              className="mt-4"
              style={{
                fontFamily: "var(--font-serif-body)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 13,
                color: "var(--brand-orange, #e85d3a)",
              }}
            >
              {t.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
