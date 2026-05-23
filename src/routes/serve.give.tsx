import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Para } from "@/components/editorial";

export const Route = createFileRoute("/serve/give")({
  head: () => ({
    meta: [
      { title: "Give — Serve · Fan The Spark" },
      { name: "description", content: "Become a digital donor — Platinum, Gold, Silver, Bronze, or Copper — and help sustain Vaisesika Dasa's online classes, podcasts, and bhakti teachings." },
      { property: "og:title", content: "Give — Serve · Fan The Spark" },
      { property: "og:description", content: "Become a digital donor — Platinum, Gold, Silver, Bronze, or Copper — and help sustain Vaisesika Dasa's online classes, podcasts, and bhakti teachings." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/serve/give" }],
  }),
  component: GivePage,
});

const LEVELS = [
  {
    name: "Platinum Level",
    img: "https://fanthespark.com/wp-content/uploads/2018/11/platinum.png",
    amount: "$251+ or 100+ hours per month",
    perks: [
      "Featured on Platinum Level Wall",
      "Exclusive invite to Conscious Living discussions",
      'Early bird access to all "Ask Vaisesika Dasa" programs',
      "Register for Spiritual Retreat two weeks early",
    ],
  },
  {
    name: "Gold Level",
    img: "https://fanthespark.com/wp-content/uploads/2018/11/gold.png",
    amount: "$101+ or 75+ hours per month",
    perks: [
      "Featured on Gold Level Wall",
      "Early bird access to 24 Ask Vaisesika Dasa programs",
      "Register for Spiritual Retreat one week early",
    ],
  },
  {
    name: "Silver Level",
    img: "https://fanthespark.com/wp-content/uploads/2018/11/silver.png",
    amount: "$51+ or 51+ hours per month",
    perks: [
      "Featured on Silver Level Wall",
      "Early bird access to 12 Ask Vaisesika Dasa programs",
    ],
  },
  {
    name: "Bronze Level",
    img: "https://fanthespark.com/wp-content/uploads/2018/11/bronze.png",
    amount: "$11+ or 11+ hours per month",
    perks: [
      "Featured on Bronze Level Wall",
      "Early bird access to 6 Ask Vaisesika Dasa programs",
    ],
  },
  {
    name: "Copper Level",
    img: "https://fanthespark.com/wp-content/uploads/2018/11/copper.png",
    amount: "$5+ or 5 hours per month",
    perks: [
      "Featured on Copper Level Wall",
      "Early bird access to 3 Ask Vaisesika Dasa programs",
    ],
  },
];

function GivePage() {
  return (
    <PlaceholderPage
      eyebrow="Serve"
      title="Give"
      intro="One of the best ways to give back and support Vaisesika Dasa's work, on all levels, is to offer a donation. Donations, like volunteer work, are part of the spiritual reciprocation process, which helps to crystalize the insights gained from our encounters with authentic teachers."
      body={
        <>
          <Para>
            In fact, for thousands of years in India, the tradition of monks has been to be supported by their students and by the communities they share their knowledge with.
          </Para>
          <Para>
            Do you regularly enjoy and benefit from Vaisesika's online classes and Bhakti yoga teachings? If so, please consider donating and becoming a digital donor. It takes an entire team of hard-working students to produce this amazing content, and the easiest way to say thank you and to support the ongoing production of Vaisesika's work is to pitch in.
          </Para>
          <Para>
            In the practice of Bhakti yoga, the easiest way to keep the inner spiritual fire stoked is to regularly offer something in exchange for the blessings we are receiving. When you pitch in, you can join the list of our digital donors below, who are some of the most important members of our team.
          </Para>

          <h2
            className="mt-14 mb-8 text-center"
            style={{
              fontFamily: "var(--font-serif-display)",
              fontStyle: "italic",
              fontSize: 36,
              color: "var(--brand-title-color, var(--foreground))",
            }}
          >
            Selfless Servant Levels
          </h2>

          <div className="grid gap-6">
            {LEVELS.map((l) => (
              <article
                key={l.name}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-5"
                style={{
                  border: "1px solid var(--brand-header-border, var(--border))",
                  borderRadius: 4,
                  padding: "24px",
                  backgroundColor: "var(--brand-header-bg, var(--card))",
                }}
              >
                <img
                  src={l.img}
                  alt={l.name}
                  loading="lazy"
                  style={{ width: 96, height: 96, objectFit: "contain", flexShrink: 0 }}
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3
                    style={{
                      fontFamily: "var(--font-serif-display)",
                      fontStyle: "italic",
                      fontSize: 24,
                      color: "var(--brand-title-color, var(--foreground))",
                    }}
                  >
                    {l.name}
                  </h3>
                  <p
                    className="mt-1 mb-3"
                    style={{
                      fontFamily: "var(--font-meta)",
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--brand-olive, var(--muted-foreground))",
                    }}
                  >
                    {l.amount}
                  </p>
                  <ul style={{ listStyle: "disc", paddingLeft: 20, margin: 0 }}>
                    {l.perks.map((p) => (
                      <li
                        key={p}
                        style={{
                          fontFamily: "var(--font-serif-body)",
                          fontSize: 15,
                          lineHeight: 1.7,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </>
      }
      contactCategory="Give"
      contactTitle="Become a Digital Donor"
    />
  );
}
