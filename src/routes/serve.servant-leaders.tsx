import { createFileRoute } from "@tanstack/react-router";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import { ContactSection } from "@/components/contact-section";
import { Dots, Para, Prose } from "@/components/editorial";

export const Route = createFileRoute("/serve/servant-leaders")({
  head: () => ({
    meta: [
      { title: "Servant Leaders — Serve · Fan The Spark" },
      { name: "description", content: "Meet the platinum, gold, silver, bronze and copper-level selfless servants whose ongoing donations and seva keep this work alive." },
      { property: "og:title", content: "Servant Leaders — Serve · Fan The Spark" },
      { property: "og:description", content: "Meet the platinum, gold, silver, bronze and copper-level selfless servants whose ongoing donations and seva keep this work alive." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/serve/servant-leaders" }],
  }),
  component: ServantLeadersPage,
});

type Leader = { name: string; role: string; img?: string };
type Group = { level: string; badge: string; leaders: Leader[] };

const GROUPS: Group[] = [
  {
    level: "Platinum Level",
    badge: "https://fanthespark.com/wp-content/uploads/2018/11/platinum.png",
    leaders: [
      { name: "Prabir & Sunita", role: "Monthly Donor", img: "https://fanthespark.com/wp-content/uploads/2019/09/Prabir-and-Sunita.png" },
      { name: "Prema-sarovara D & Sruti-priya DD", role: "Monthly Donor", img: "https://fanthespark.com/wp-content/uploads/2019/01/Platinum-Poonam-4.jpg" },
      { name: "Pavani-Bhakti DD", role: "Donor / Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/01/Platinum-JP-1.jpg" },
    ],
  },
  {
    level: "Gold Level",
    badge: "https://fanthespark.com/wp-content/uploads/2018/11/gold.png",
    leaders: [
      { name: "Iluta Callies", role: "Donor / Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Iluta.png" },
      { name: "Dhira-Prasanta D", role: "Donor / Volunteer" },
      { name: "Venu-Gita D", role: "Donor / Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Venu-gita-mataji.png" },
    ],
  },
  {
    level: "Silver Level",
    badge: "https://fanthespark.com/wp-content/uploads/2018/11/silver.png",
    leaders: [
      { name: "Sumit Prabhu", role: "Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Sumit-Prabhu.png" },
      { name: "Sat-sandarbha D", role: "Volunteer", img: "https://fanthespark.com/wp-content/uploads/2020/01/Selfless-Service-Leader-Silver.png" },
    ],
  },
  {
    level: "Bronze Level",
    badge: "https://fanthespark.com/wp-content/uploads/2018/11/bronze.png",
    leaders: [
      { name: "Namrata Keswani", role: "Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Nam-Keswani.png" },
      { name: "Rupamanjari DD", role: "Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Rupamanjari.png" },
      { name: "Divya Nama D", role: "Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Divya-nama-prabhu.png" },
      { name: "Amrta Katha D", role: "Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Anjali.png" },
      { name: "Citralekha-Sakhi DD", role: "Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Chitra-lekha-DD.png" },
      { name: "Ishvari Jhanava D", role: "Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Ishvara-Jhanava-DD.png" },
    ],
  },
  {
    level: "Copper Level",
    badge: "https://fanthespark.com/wp-content/uploads/2018/11/copper.png",
    leaders: [
      { name: "Prema-Kisori DD", role: "Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Prema-kisori-Mataji.png" },
      { name: "Sutra-Malika D", role: "Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Sutra-malika-Prabhu.png" },
      { name: "Palika DD", role: "Volunteer", img: "https://fanthespark.com/wp-content/uploads/2019/09/Purnima-Mataji.png" },
    ],
  },
];

function ServantLeadersPage() {
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
            Serve
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
            Servant Leaders
          </h1>
        </div>
      </section>

      <Prose tight="bottom">
        <Dots />
        <Para>
          Do you regularly enjoy and benefit from Vaisesika's online classes and Bhakti yoga teachings? If so, please consider donating and becoming a digital donor. It takes an entire team of hard-working students to produce this amazing content, and the easiest way to say thank you and to support the ongoing production of Vaisesika's work is to pitch in.
        </Para>
        <Para>
          In the practice of Bhakti yoga, the easiest way to keep the inner spiritual fire stoked is to regularly offer something in exchange for the blessings we are receiving. When you pitch in, you join the list of our selfless servants below — some of the most important members of our team.
        </Para>
      </Prose>

      <section style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-[1100px] px-6 pb-16 sm:pb-24">
          {GROUPS.map((g) => (
            <div key={g.level} className="mb-16 last:mb-0">
              <div className="flex items-center justify-center gap-4 mb-10">
                <img
                  src={g.badge}
                  alt={g.level}
                  loading="lazy"
                  style={{ width: 56, height: 56, objectFit: "contain" }}
                />
                <h2
                  style={{
                    fontFamily: "var(--font-serif-display)",
                    fontStyle: "italic",
                    fontSize: 36,
                    color: "var(--brand-title-color, var(--foreground))",
                  }}
                >
                  {g.level}
                </h2>
              </div>
              <div className="grid gap-8 sm:gap-10 grid-cols-2 md:grid-cols-3">
                {g.leaders.map((l) => (
                  <figure key={l.name} className="text-center">
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        overflow: "hidden",
                        borderRadius: "50%",
                        backgroundColor: "var(--brand-header-bg, var(--muted))",
                        border: "1px solid var(--brand-header-border, var(--border))",
                        marginBottom: 14,
                      }}
                    >
                      {l.img ? (
                        <img
                          src={l.img}
                          alt={l.name}
                          loading="lazy"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-serif-display)",
                            fontStyle: "italic",
                            fontSize: 40,
                            color: "var(--brand-olive, var(--muted-foreground))",
                          }}
                        >
                          {l.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <figcaption>
                      <p
                        style={{
                          fontFamily: "var(--font-serif-display)",
                          fontStyle: "italic",
                          fontSize: 18,
                          lineHeight: 1.25,
                          color: "var(--brand-title-color, var(--foreground))",
                        }}
                      >
                        {l.name}
                      </p>
                      <p
                        className="mt-1"
                        style={{
                          fontFamily: "var(--font-meta)",
                          fontSize: 10,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: "var(--brand-olive, var(--muted-foreground))",
                        }}
                      >
                        {l.role}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactSection defaultCategory="Servant Leaders" title="Join the Team" />
    </SiteLayoutWeb>
  );
}
