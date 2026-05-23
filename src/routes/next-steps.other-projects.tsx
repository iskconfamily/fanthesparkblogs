import { createFileRoute } from "@tanstack/react-router";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import { ContactSection } from "@/components/contact-section";
import { Dots, Para, Prose } from "@/components/editorial";

export const Route = createFileRoute("/next-steps/other-projects")({
  head: () => ({
    meta: [
      { title: "Other Projects — Next Steps · Fan The Spark" },
      { name: "description", content: "A wider family of sankirtana projects Vaisesika Dasa has founded or inspired — uniting devotees around the shared aim of widely distributing the holy names." },
      { property: "og:title", content: "Other Projects — Next Steps · Fan The Spark" },
      { property: "og:description", content: "A wider family of sankirtana projects Vaisesika Dasa has founded or inspired — uniting devotees around the shared aim of widely distributing the holy names." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/next-steps/other-projects" }],
  }),
  component: OtherProjectsPage,
});

type Project = {
  name: string;
  blurb: string;
  url?: string;
  urlLabel?: string;
};

const PROJECTS: Project[] = [
  {
    name: "NST — North American Sankirtana Team",
    blurb:
      "NST is a coalition of sankirtana leaders in America and Canada who meet through regular conference calls and a Yahoogroup to share best practices for the improvement and expansion of Sankirtana.",
  },
  {
    name: "Northern California Sankirtana",
    blurb:
      "Northern California is one of the most unique and culturally diverse areas in the world. Uniting the devotees in Northern California we expand the Sankirtana movement throughout Northern California.",
    url: "https://fanthespark.files.wordpress.com/2009/12/vision32.pdf",
    urlLabel: "View PDF for more information",
  },
  {
    name: "DistributeBooks.com",
    blurb:
      "We maintain a website through which devotees all over the world can learn and share best practices for improving and expanding book distribution.",
    url: "http://distributebooks.com",
    urlLabel: "Visit website",
  },
  {
    name: "SSF — Sankirtana Strategic Forum",
    blurb:
      "SSF is a 'think tank,' bringing together key sankirtana strategists from around the world to discuss, implement and promote innovative methods for distributing spiritual knowledge for the benefit of all.",
  },
  {
    name: "Pancajanya Project",
    blurb:
      "ISKCON of Silicon Valley (ISV) has recently started a program of placing soft bound English language editions of Bhagavad Gita in hotel/motel rooms, similar to the placing of Holy Bibles by the Gideons. We started this Pancajanya Project in April 2008, primarily in the San Francisco Bay Area, but we have already received a great deal of very positive feedback from owners and guests alike. We have therefore decided to expand the program.",
    url: "http://www.motelgita.org/",
    urlLabel: "Visit website",
  },
  {
    name: "ISKCON of Silicon Valley",
    blurb:
      "ISKCON of Silicon Valley: your ultimate destination for Bhakti Yoga — a complete experience for the body, mind and soul.",
    url: "http://iskconsiliconvalley.com/",
    urlLabel: "Visit website",
  },
];

function OtherProjectsPage() {
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
            Next Steps
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
            Other Projects
          </h1>
        </div>
      </section>

      <Prose tight="bottom">
        <Dots />
        <Para>
          Vaisesika Dasa is founder and inspiration of many projects. While his contributions are endlessly dynamic in order to engage all sorts of people, there is a common theme to his work. At the very heart of Vaisesika Prabhu's work is the belief in <em>"Serving all living entities by widely distributing the holy names of Lord Krsna through Sankirtana."</em>
        </Para>
      </Prose>

      <section style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-[900px] px-6 pb-16 sm:pb-24">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {PROJECTS.map((p) => (
              <article
                key={p.name}
                style={{
                  border: "1px solid var(--brand-header-border, var(--border))",
                  borderRadius: 4,
                  padding: "28px 24px",
                  backgroundColor: "var(--brand-header-bg, var(--card))",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h2
                  className="mb-3"
                  style={{
                    fontFamily: "var(--font-serif-display)",
                    fontStyle: "italic",
                    fontSize: 24,
                    lineHeight: 1.2,
                    color: "var(--brand-title-color, var(--foreground))",
                  }}
                >
                  {p.name}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-serif-body)",
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: "var(--muted-foreground)",
                    flex: 1,
                  }}
                >
                  {p.blurb}
                </p>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block uppercase no-underline"
                    style={{
                      fontFamily: "var(--font-meta)",
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      color: "var(--brand-olive, var(--muted-foreground))",
                      borderBottom: "1px solid var(--brand-gold, currentColor)",
                      paddingBottom: 2,
                      alignSelf: "flex-start",
                    }}
                  >
                    {p.urlLabel ?? "Visit"}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactSection
        defaultCategory="Other Projects"
        title="Get Involved"
      />
    </SiteLayoutWeb>
  );
}
