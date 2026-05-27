import { Link } from "@tanstack/react-router";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import { ContactSection } from "@/components/contact-section";
import { Dots, Para, Prose } from "@/components/editorial";

interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  intro?: string;
  body?: React.ReactNode;
  contactCategory?: string;
  contactTitle?: string;
  headerAccent?: React.ReactNode;
}

export function PlaceholderPage({
  eyebrow,
  title,
  intro,
  body,
  contactCategory,
  contactTitle,
  headerAccent,
}: PlaceholderPageProps) {
  return (
    <SiteLayoutWeb>
      {/* HERO BAND — type only, or with optional accent */}
      <section
        className="w-full"
        style={{
          backgroundColor: "var(--brand-header-bg, var(--muted))",
          borderBottom: "1px solid var(--brand-header-border, var(--border))",
        }}
      >
        {headerAccent ? (
          <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20 lg:py-24">
            <div className="grid gap-10 lg:gap-14 lg:grid-cols-[1.2fr_1fr] items-center">
              <div className="text-center lg:text-left">
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
                  {eyebrow}
                </p>
                <h1
                  style={{
                    fontFamily: "var(--font-serif-display)",
                    fontSize: "clamp(40px, 5.5vw, 72px)",
                    fontStyle: "italic",
                    fontWeight: 500,
                    lineHeight: 1.05,
                    color: "var(--brand-title-color, var(--foreground))",
                  }}
                >
                  {title}
                </h1>
              </div>
              <div className="w-full">{headerAccent}</div>
            </div>
          </div>
        ) : (
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
              {eyebrow}
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
              {title}
            </h1>
          </div>
        )}
      </section>

      {/* LEAD */}
      <Prose tight="bottom">
        <Dots />
        {intro ? <Para>{intro}</Para> : null}
      </Prose>

      {body ? <Prose tight="top">{body}</Prose> : null}

      <ContactSection
        defaultCategory={contactCategory}
        title={contactTitle ?? "Serving All Areas of Life"}
      />
    </SiteLayoutWeb>
  );
}

interface HubLink {
  to: string;
  label: string;
  blurb: string;
  external?: boolean;
}

interface HubPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  links: HubLink[];
  contactCategory?: string;
}

export function HubPage({ eyebrow, title, intro, links, contactCategory }: HubPageProps) {
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
            {eyebrow}
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
            {title}
          </h1>
        </div>
      </section>

      <Prose tight="bottom">
        <Dots />
        <Para>{intro}</Para>
      </Prose>

      <section style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-[1100px] px-6 pb-16 sm:pb-24">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {links.map((l) => {
              const cardStyle = {
                border: "1px solid var(--brand-header-border, var(--border))",
                borderRadius: 4,
                padding: "28px 24px",
                backgroundColor: "var(--brand-header-bg, var(--card))",
                transition: "transform 200ms ease, box-shadow 200ms ease",
              } as const;
              const inner = (
                <>
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
                    {l.external ? "Visit" : "Explore"}
                  </p>
                  <h2
                    className="mb-3"
                    style={{
                      fontFamily: "var(--font-serif-display)",
                      fontStyle: "italic",
                      fontSize: 26,
                      lineHeight: 1.15,
                      color: "var(--brand-title-color, var(--foreground))",
                    }}
                  >
                    {l.label}
                  </h2>
                  <p
                    style={{
                      fontFamily: "var(--font-serif-body)",
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {l.blurb}
                  </p>
                </>
              );
              return l.external ? (
                <a
                  key={l.to}
                  href={l.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group no-underline"
                  style={cardStyle}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block group no-underline"
                  style={cardStyle}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <ContactSection defaultCategory={contactCategory} />
    </SiteLayoutWeb>
  );
}
