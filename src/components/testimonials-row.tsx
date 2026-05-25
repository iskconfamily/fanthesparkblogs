export const TESTIMONIALS: { quote: string; author: string }[] = [
  {
    quote:
      "Vaisesika Dasa is a treasure — if you ever have the opportunity to hear him, take it!",
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

export function TestimonialsRow({
  heading = "In Their Own Words",
}: {
  heading?: string;
}) {
  return (
    <section
      className="w-full"
      style={{
        backgroundColor: "var(--brand-header-bg, var(--muted))",
        borderTop: "1px solid var(--brand-header-border, var(--border))",
        borderBottom: "1px solid var(--brand-header-border, var(--border))",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
        <p
          className="mb-10 sm:mb-14 text-center"
          style={{
            fontFamily: "var(--font-meta)",
            fontSize: 12,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "var(--brand-olive, var(--muted-foreground))",
          }}
        >
          {heading}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="flex flex-col">
              <blockquote
                style={{
                  fontFamily: "var(--font-serif-body)",
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: "var(--brand-title-color, var(--foreground))",
                }}
              >
                {t.quote}
              </blockquote>
              <figcaption
                className="mt-5"
                style={{
                  fontFamily: "var(--font-serif-body)",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--brand-orange, #d96a4a)",
                }}
              >
                {t.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
