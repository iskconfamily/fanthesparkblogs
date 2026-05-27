import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Para } from "@/components/editorial";
import { Laptop, Sparkles, Mountain, BookOpen, UtensilsCrossed } from "lucide-react";

const ACCENT_TILES = [
  { Icon: Laptop, label: "Digital" },
  { Icon: Sparkles, label: "Mindfulness" },
  { Icon: Mountain, label: "Retreats" },
  { Icon: BookOpen, label: "Books" },
  { Icon: UtensilsCrossed, label: "Cooking" },
];

function VolunteerAccent() {
  return (
    <div
      className="mx-auto lg:mx-0 max-w-[420px] grid grid-cols-3 gap-3"
      style={{ padding: 4 }}
    >
      {ACCENT_TILES.map(({ Icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center text-center"
          style={{
            aspectRatio: "1 / 1",
            border: "1px solid var(--brand-header-border, var(--border))",
            borderRadius: 8,
            backgroundColor: "var(--brand-header-bg, var(--card))",
            padding: 12,
          }}
        >
          <Icon
            size={28}
            strokeWidth={1.4}
            style={{ color: "var(--brand-olive, var(--muted-foreground))" }}
          />
          <span
            className="mt-2"
            style={{
              fontFamily: "var(--font-meta)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--brand-olive, var(--muted-foreground))",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export const Route = createFileRoute("/serve/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer — Serve · Fan The Spark" },
      { name: "description", content: "Selfless service — seva — is the most beneficial method for deepening what we've received. Lend your time and skills across digital, retreats, books, and conscious cooking." },
      { property: "og:title", content: "Volunteer — Serve · Fan The Spark" },
      { property: "og:description", content: "Selfless service — seva — is the most beneficial method for deepening what we've received. Lend your time and skills across digital, retreats, books, and conscious cooking." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/serve/volunteer" }],
  }),
  component: VolunteerPage,
});

const AREAS = [
  {
    title: "Digital Service",
    blurb: "Website maintenance, content translations, digital service development and support, content editing, video editing, and digital marketing and growth.",
  },
  {
    title: "Mindfulness & Conscious Living Program",
    blurb: "Planning and implementing spiritual talks and events, program growth and development, organizing local programs, and broadcasting them.",
  },
  {
    title: "Spiritual Retreat",
    blurb: "Help with planning and implementing spiritual retreats.",
  },
  {
    title: "Book Publishing",
    blurb: "Help with book content planning, content editing, book design, publication strategy, pricing, marketing, and distribution.",
  },
  {
    title: "Conscious Cooking",
    blurb: "Help with planning and implementing Conscious Cooking at various events.",
  },
];

const LEVELS = [
  { name: "Platinum Level Leaders", hours: "100+ hours per month" },
  { name: "Gold Level Leaders", hours: "75+ hours per month" },
  { name: "Silver Level Leaders", hours: "51+ hours per month" },
  { name: "Bronze Level Leaders", hours: "11+ hours per month" },
  { name: "Copper Level Leaders", hours: "5+ hours per month" },
];

function VolunteerPage() {
  return (
    <PlaceholderPage
      eyebrow="Serve"
      title="Volunteer"
      headerAccent={<VolunteerAccent />}
      intro="Have you benefited from hanging out with Vaisesika Dasa, hearing one of his talks, or attending one of his retreats or local circles? Want to find a way of giving something back?"
      body={
        <>
          <Para>
            In the yogic tradition, selfless service, or <em>"seva,"</em> is recommended as the most beneficial method for deepening that which we've received as a gift from spirit. In this way a circle is completed, and energy continues to flow continuously, deepening our spiritual life more and more as we learn and give, give and learn.
          </Para>

          <h2
            className="mt-12 mb-6 text-center"
            style={{
              fontFamily: "var(--font-serif-display)",
              fontStyle: "italic",
              fontSize: 32,
              color: "var(--brand-title-color, var(--foreground))",
            }}
          >
            Ways to Serve
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {AREAS.map((a) => (
              <li key={a.title} className="mb-6">
                <p
                  className="mb-1"
                  style={{
                    fontFamily: "var(--font-meta)",
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--brand-olive, var(--muted-foreground))",
                  }}
                >
                  {a.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif-body)",
                    fontSize: 18,
                    lineHeight: 1.75,
                    color: "var(--foreground)",
                  }}
                >
                  {a.blurb}
                </p>
              </li>
            ))}
          </ul>

          <h2
            className="mt-14 mb-6 text-center"
            style={{
              fontFamily: "var(--font-serif-display)",
              fontStyle: "italic",
              fontSize: 32,
              color: "var(--brand-title-color, var(--foreground))",
            }}
          >
            Volunteer Levels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LEVELS.map((l) => (
              <div
                key={l.name}
                style={{
                  border: "1px solid var(--brand-header-border, var(--border))",
                  padding: "18px 20px",
                  borderRadius: 4,
                  backgroundColor: "var(--brand-header-bg, var(--card))",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif-display)",
                    fontStyle: "italic",
                    fontSize: 20,
                    color: "var(--brand-title-color, var(--foreground))",
                  }}
                >
                  {l.name}
                </p>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: "var(--font-meta)",
                    fontSize: 12,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--brand-olive, var(--muted-foreground))",
                  }}
                >
                  {l.hours}
                </p>
              </div>
            ))}
          </div>
        </>
      }
      contactCategory="Volunteer"
      contactTitle="Sign Up to Volunteer"
    />
  );
}
