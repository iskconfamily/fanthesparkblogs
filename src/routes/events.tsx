import { createFileRoute } from "@tanstack/react-router";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import { ContactSection } from "@/components/contact-section";
import { Dots, Para, Prose } from "@/components/editorial";
import { EventCard } from "@/components/event-card";
import { getPublishedEvents, type EventRow } from "@/lib/events.functions";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Fan The Spark" },
      { name: "description", content: "Upcoming talks, retreats, kirtans and travels with Vaisesika Dasa." },
      { property: "og:title", content: "Events — Fan The Spark" },
      { property: "og:description", content: "Upcoming talks, retreats, kirtans and travels with Vaisesika Dasa." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/events" }],
  }),
  loader: () => getPublishedEvents(),
  component: EventsPage,
});

function EventsPage() {
  const { upcoming, past } = Route.useLoaderData();

  return (
    <SiteLayoutWeb>
      <section
        className="w-full"
        style={{
          backgroundColor: "var(--brand-header-bg, var(--muted))",
          borderBottom: "1px solid var(--brand-header-border, var(--border))",
        }}
      >
        <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-28 text-center">
          <p
            className="mb-4"
            style={{
              fontFamily: "var(--font-meta)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--brand-olive, var(--muted-foreground))",
            }}
          >
            Events
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif-display)",
              fontSize: "clamp(44px, 6.5vw, 80px)",
              fontStyle: "italic",
              fontWeight: 500,
              lineHeight: 1.05,
              color: "var(--brand-title-color, var(--foreground))",
            }}
          >
            Events
          </h1>
        </div>
      </section>

      <Prose tight="bottom">
        <Dots />
        <Para>
          Talks, retreats, kirtans, and travels with Vaisesika Dasa. Join us on-site or online.
        </Para>
      </Prose>

      <EventSection title="Upcoming Events" events={upcoming} emptyText="No upcoming events at the moment. Please check back soon." />
      <EventSection title="Past Events" events={past} muted />

      <ContactSection defaultCategory="Events" title="Questions About an Event?" />
    </SiteLayoutWeb>
  );
}

function EventSection({
  title,
  events,
  emptyText,
  muted = false,
}: {
  title: string;
  events: EventRow[];
  emptyText?: string;
  muted?: boolean;
}) {
  if (!events.length && !emptyText) return null;
  return (
    <section style={{ backgroundColor: "var(--background)" }}>
      <div className="mx-auto max-w-[1100px] px-6 pb-16 sm:pb-24">
        <h2
          className="mb-10 text-center"
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: 38,
            color: "var(--brand-title-color, var(--foreground))",
            opacity: muted ? 0.85 : 1,
          }}
        >
          {title}
        </h2>
        {events.length === 0 ? (
          <p
            className="text-center"
            style={{
              fontFamily: "var(--font-serif-body)",
              fontSize: 17,
              color: "var(--muted-foreground)",
            }}
          >
            {emptyText}
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} compact={muted} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Re-export Link to avoid unused-import warning if needed later.
export { Link };
