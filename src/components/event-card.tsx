import type { EventRow } from "@/lib/events.functions";

function formatDateRange(start: string, end: string): string {
  // start/end are YYYY-MM-DD
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const sDate = new Date(Date.UTC(sy, sm - 1, sd));
  const eDate = new Date(Date.UTC(ey, em - 1, ed));
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...opts }).format(d);

  if (start === end) {
    return fmt(sDate, { month: "long", day: "numeric", year: "numeric" });
  }
  const sameMonth = sy === ey && sm === em;
  const sameYear = sy === ey;
  if (sameMonth) {
    return `${fmt(sDate, { month: "long", day: "numeric" })}–${fmt(eDate, { day: "numeric", year: "numeric" })}`;
  }
  if (sameYear) {
    return `${fmt(sDate, { month: "long", day: "numeric" })} – ${fmt(eDate, { month: "long", day: "numeric", year: "numeric" })}`;
  }
  return `${fmt(sDate, { month: "long", day: "numeric", year: "numeric" })} – ${fmt(eDate, { month: "long", day: "numeric", year: "numeric" })}`;
}

export function EventCard({ event, compact = false }: { event: EventRow; compact?: boolean }) {
  return (
    <article
      style={{
        border: "1px solid var(--brand-header-border, var(--border))",
        borderRadius: 4,
        backgroundColor: "var(--brand-header-bg, var(--card))",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {event.image_url ? (
        <div
          style={{
            width: "100%",
            aspectRatio: compact ? "16 / 9" : "3 / 2",
            overflow: "hidden",
            backgroundColor: "var(--muted)",
          }}
        >
          <img
            src={event.image_url}
            alt={event.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      ) : null}
      <div style={{ padding: compact ? "20px 22px" : "26px 26px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p
          className="mb-2"
          style={{
            fontFamily: "var(--font-meta)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--brand-olive, var(--muted-foreground))",
          }}
        >
          {formatDateRange(event.start_date, event.end_date)}
        </p>
        <h3
          className="mb-2"
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: compact ? 22 : 26,
            lineHeight: 1.2,
            color: "var(--brand-title-color, var(--foreground))",
          }}
        >
          {event.title}
        </h3>
        <p
          className="mb-2"
          style={{
            fontFamily: "var(--font-serif-body)",
            fontSize: 14,
            color: "var(--muted-foreground)",
          }}
        >
          {event.location}
        </p>
        {event.short_note ? (
          <p
            style={{
              fontFamily: "var(--font-serif-body)",
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--foreground)",
              marginTop: "auto",
              paddingTop: 10,
            }}
          >
            {event.short_note}
          </p>
        ) : null}
      </div>
    </article>
  );
}
