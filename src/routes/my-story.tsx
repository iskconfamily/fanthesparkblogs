import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import dotsUrl from "@/assets/my-story/dots.png";
import heroForest from "@/assets/my-story/vaisesika-meditation.png";
import templeNamaste from "@/assets/my-story/vaisesika-portico.png";

export const Route = createFileRoute("/my-story")({
  head: () => ({
    meta: [
      { title: "My Story — Fan The Spark" },
      {
        name: "description",
        content:
          "From childhood questions about the mystery of life to a lifetime of bhakti-yoga practice — the personal journey of Vaisesika Dasa.",
      },
      { property: "og:title", content: "My Story — Fan The Spark" },
      {
        property: "og:description",
        content:
          "From childhood questions about the mystery of life to a lifetime of bhakti-yoga practice — the personal journey of Vaisesika Dasa.",
      },
      { property: "og:image", content: heroForest },
    ],
  }),
  component: MyStoryPage,
});

const heroImageStyles = `
  .my-story-hero-image {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 5;
    height: auto;
    max-height: 560px;
    object-fit: cover;
    object-position: 40% 45%;
  }

  @media (min-width: 1024px) {
    .my-story-hero-image {
      aspect-ratio: auto;
      height: auto;
      max-height: min(70vh, 760px);
      object-fit: cover;
      object-position: center 18%;
    }
  }

  @media (min-width: 1800px) and (min-aspect-ratio: 2 / 1) {
    .my-story-hero-image {
      max-height: 74vh;
      object-fit: cover;
      object-position: center 24%;
    }
  }
`;

function Dots() {
  return (
    <div className="flex justify-center my-6 sm:my-10">
      <img src={dotsUrl} alt="" aria-hidden="true" style={{ height: 14, width: "auto", opacity: 0.85 }} />
    </div>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-7"
      style={{
        fontFamily: "var(--font-serif-body)",
        fontSize: 19,
        lineHeight: 1.85,
        color: "var(--foreground)",
      }}
    >
      {children}
    </p>
  );
}

function Prose({
  children,
  tight,
}: {
  children: React.ReactNode;
  tight?: "top" | "bottom" | "both";
}) {
  const pt = tight === "top" || tight === "both" ? "pt-4 sm:pt-8" : "pt-4 sm:pt-10";
  const pb = tight === "bottom" || tight === "both" ? "pb-4 sm:pb-8" : "pb-10 sm:pb-12";
  return (
    <section style={{ backgroundColor: "var(--background)" }}>
      <div className={`mx-auto max-w-[720px] px-6 ${pt} ${pb}`}>{children}</div>
    </section>
  );
}

function MyStoryPage() {
  return (
    <SiteLayoutWeb>
      <style>{heroImageStyles}</style>

      {/* HERO — real img, no-crop on normal screens; soft cap only on very wide cinematic renderings */}
      <section className="relative w-full" style={{ backgroundColor: "#1a1a0d" }}>
        <img
          src={heroForest}
          alt="Vaisesika Dasa in meditation in a forest clearing"
          className="my-story-hero-image"
        />

        {/* Bottom-left title overlay — no gradient wash, just text shadow */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1200px] px-6 pb-8 sm:pb-12">
            <div className="max-w-[560px]">
              <p
                className="mb-3"
                style={{
                  fontFamily: "var(--font-meta)",
                  fontSize: 12,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "#fef9e9",
                  textShadow: "0 1px 8px rgba(0,0,0,0.55)",
                }}
              >
                My Journey
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-serif-display)",
                  fontSize: "clamp(48px, 7.5vw, 88px)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  lineHeight: 1.02,
                  color: "#fffaf0",
                  textShadow: "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.45)",
                }}
              >
                My Story
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD */}
      <Prose tight="bottom">
        <Dots />
        <Para>
          When I was a child, I was deeply curious about the mystery of life. Trying to wrap my mind
          around it, I would sometimes ask my parents about the reasons for death. They thought that
          because I was so young, I shouldn’t worry about it. But, I did.
        </Para>
      </Prose>

      {/* YOUTUBE — wider container */}
      <section style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-[960px] px-6 pt-2 pb-6 sm:pt-4 sm:pb-10">
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%",
              overflow: "hidden",
              borderRadius: 4,
              border: "1px solid var(--brand-header-border, var(--border))",
              backgroundColor: "var(--brand-header-bg, var(--muted))",
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/vF_A_TcAgtM"
              title="My Journey — My Story || Vaisesika Dasa"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </div>
        </div>
      </section>

      {/* BODY — first half + pull quote */}
      <Prose tight="top">

        <Para>
          I remember looking up at the night sky, asking my big brother, “What’s on the other
          side?” He couldn’t say but I wanted to know more than anything. By the time I was in high
          school, although I went to classes, I frequently questioned the value of my studies if
          they didn’t lead me to answer my two most burning questions:
        </Para>

        <blockquote
          className="my-12 mx-auto text-center"
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: "clamp(26px, 3.4vw, 34px)",
            lineHeight: 1.35,
            color: "var(--brand-title-color)",
            borderLeft: "none",
            paddingLeft: 0,
            maxWidth: 600,
          }}
        >
          “What is the purpose of life?” <br />
          And, “Why must I die?”
        </blockquote>

        <Para>
          So during my junior year, I renounced the material world. I quit my sports team, I walked
          to school barefoot, I gave away all my possessions except a small Buddha statue, a few
          spiritual books, the most basic clothes, and a blanket for sleeping on the floor.
        </Para>

        <Para>
          I distanced myself from my friends and dealt sparingly with my family at home.
          Understandably, my parents were alarmed by the abrupt change and they had to take me to a
          psychiatric evaluation. Outwardly I appeared misguided, but inwardly I felt a presence –
          One who truly understood me, and was nudging me along this spiritual path. It was an
          incredible relief.
        </Para>

        <Para>
          I had decided to find the meaning of life, at any cost. Although I fancied myself a yogi
          living in the Himalaya, I was still a teen, living at home in suburbia with my parents. I
          was determined but I did not know exactly what to do next.
        </Para>

        <Para>
          Then, one day, as I sat in my room, fasting, meditating on a candle flame and chanting a
          mantra I had extracted from a book, my high school friend, Richie Corsa, knocked on the
          bedroom door. I didn’t answer but he spoke through the door so that I could hear him.
        </Para>

        <Para>
          “A monk sold me this magazine when I was downtown. It’s some spiritual thing. I am not
          interested in this stuff, but I know you are!”
        </Para>

        <Para>
          He left the magazine outside my door. After a while, I went to see what kind of magazine
          he left me. It was propped against the wall next to my door. The shiny cover illustration
          of the Avatar, Caitanya, arms raised in the air, dancing through a tropical landscape,
          immediately caught my eye.
        </Para>

        <Para>
          The masthead read, “Back to Godhead. Godhead is Light. Nescience is Darkness. Where There
          Is Godhead There Is No Nescience.” Richie was spot on. I was interested in this stuff. I
          carried it into my room to have a closer look.
        </Para>

        <Para>
          Opening the magazine, my eyes locked onto a painting of a golden brown-complexioned guru.
          His head was cleanly shaven and he sat cross-legged on an ornate seat. He wore flowing
          saffron robes, and a flower garlands around his neck. His wise but compassionate gaze
          captured my heart.
        </Para>

        <Para>
          Below the painting the caption read: “His Divine Grace A. C. Bhaktivedanta Swami
          Prabhupāda.” Suddenly, a singular thought entered my mind: This is my teacher. Never
          before had I been gripped with such an absolute conviction. I stared at the portrait for
          several minutes, and it occurred to me that it was utterly mystical for this magazine to
          have appeared at my door.
        </Para>

        <Para>
          I turned the pages with rapt attention. That was in the summer of 1973. After deep study
          of my guru’s writings and with my parents’ support, I became a monk at sixteen. For the
          next 13 years, my spiritual practice grew deeper and richer.
        </Para>
      </Prose>

      {/* FULL-BLEED TEMPLE PHOTO */}
      <section className="w-full">
        <img
          src={templeNamaste}
          alt="Vaisesika Dasa in prayer at a temple"
          className="block w-full h-auto"
          style={{
            maxHeight: "88vh",
            objectFit: "cover",
            objectPosition: "center 30%",
          }}
        />
      </section>

      {/* CLOSING PROSE + CTA */}
      <Prose>
        <Para>
          In 1986, friends introduced me to Nirakula Dasi – a fellow disciple of my guru, Srila
          Prabhupada. She had a pure heart and a radiant, beautiful smile. We felt an immediate
          connection and had similar goals. So we soon married and began building a life together.
          Living outside the monastery was a little awkward at first, but ultimately we learned how
          to integrate spiritual principles into a modern fast-paced life with its layers of
          pressing responsibilities.
        </Para>

        <Para>
          As it turned out, being steeped in spiritual practice was tremendously beneficial. It
          provided steadfast joy even while dealing with the complexities of the modern world.
          Whatever challenges showed up, we could meet them with peacefulness, creativity and
          resolve.
        </Para>

        <Para>
          Today, my work revolves around sharing with others the gems that I have received. It’s
          not practical for everyone to renounce the world and live in a monastery, but the most
          potent spiritual tools are available for everyone to use within normal daily life.
        </Para>

        <Para>
          I appreciate the time you have taken to hear my story. Now I would love to hear your
          story. Please drop me a note.
        </Para>

        <Dots />

        <div className="text-center mt-10">
          <Link
            to="/contact"
            className="inline-block no-underline"
            style={{
              fontFamily: "var(--font-meta)",
              fontSize: 12,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--brand-title-color)",
              borderBottom: "1px solid var(--brand-gold)",
              paddingBottom: 4,
            }}
          >
            Share your story
          </Link>
        </div>
      </Prose>
    </SiteLayoutWeb>
  );
}
