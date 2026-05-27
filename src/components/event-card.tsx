import type { EventRow } from "@/lib/events.functions";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function parts(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return { y, m, day };
}

function formatDateRange(start: string, end: string): string {
  const s = parts(start);
  const e = parts(end);
  if (start === end) return `${MONTHS[s.m - 1]} ${s.day}, ${s.y}`;
  if (s.y === e.y && s.m === e.m) {
    return `${MONTHS[s.m - 1]} ${s.day}–${e.day}, ${s.y}`;
  }
  if (s.y === e.y) {
    return `${MONTHS[s.m - 1]} ${s.day} – ${MONTHS[e.m - 1]} ${e.day}, ${s.y}`;
  }
  return `${MONTHS[s.m - 1]} ${s.day}, ${s.y} – ${MONTHS[e.m - 1]} ${e.day}, ${e.y}`;
}

function durationDays(start: string, end: string): number {
  const s = parts(start);
  const e = parts(end);
  const sUTC = Date.UTC(s.y, s.m - 1, s.day);
  const eUTC = Date.UTC(e.y, e.m - 1, e.day);
  return Math.round((eUTC - sUTC) / 86400000) + 1;
}

export function EventCard({ event, compact = false }: { event: EventRow; compact?: boolean }) {
  const s = parts(event.start_date);
  const days = durationDays(event.start_date, event.end_date);

  return (
    <article
      style={{
        border: "1px solid var(--brand-header-border, var(--border))",
        backgroundColor: "var(--brand-header-bg, var(--card))",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {event.image_url ? (
        <div
          style={{
            position: "relative",
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
          {/* Date chip overlay */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              backgroundColor: "var(--brand-header-bg, var(--card))",
              border: "1px solid var(--brand-header-border, var(--border))",
              padding: "8px 12px 6px",
              textAlign: "center",
              minWidth: 56,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-meta)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--brand-olive, var(--muted-foreground))",
                lineHeight: 1,
              }}
            >
              {MONTHS_SHORT[s.m - 1]}
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif-display)",
                fontSize: 24,
                lineHeight: 1.1,
                color: "var(--brand-title-color, var(--foreground))",
                marginTop: 2,
              }}
            >
              {s.day}
            </div>
          </div>
        </div>
      ) : null}
      <div
        style={{
          padding: compact ? "22px 24px 24px" : "28px 28px 30px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          className="mb-3"
          style={{
            fontFamily: "var(--font-meta)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--brand-olive, var(--muted-foreground))",
          }}
        >
          {formatDateRange(event.start_date, event.end_date)}
          <span style={{ opacity: 0.5 }}>  ·  </span>
          {days} Days
        </p>
        <h3
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: compact ? 22 : 28,
            lineHeight: 1.15,
            color: "var(--brand-title-color, var(--foreground))",
          }}
        >
          {event.title}
        </h3>
        {event.short_note ? (
          <p
            style={{
              fontFamily: "var(--font-serif-body)",
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--foreground)",
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid var(--brand-header-border, var(--border))",
            }}
          >
            {event.short_note}
          </p>
        ) : null}
      </div>
    </article>
  );
}
