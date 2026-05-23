import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import { ContactSection } from "@/components/contact-section";
import { Dots } from "@/components/editorial";
import storyImage from "@/assets/my-story/vaisesika-meditation.png";
import guruImage from "@/assets/my-guru/prabhupada-hero.png";

export const Route = createFileRoute("/my-journey/")({
  head: () => ({
    meta: [
      { title: "My Journey — Fan The Spark" },
      {
        name: "description",
        content:
          "The personal story of Vaisesika Dasa and the shelter of his guru, Srila Prabhupada.",
      },
      { property: "og:title", content: "My Journey — Fan The Spark" },
      {
        property: "og:description",
        content:
          "The personal story of Vaisesika Dasa and the shelter of his guru, Srila Prabhupada.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://fanthesparkblogs.lovable.app/my-journey" },
    ],
  }),
  component: MyJourneyHub,
});

const tileStyles = `
  .mj-tile { display: block; text-decoration: none; color: inherit; }
  .mj-tile-img-wrap {
    overflow: hidden;
    border-radius: 4px;
    background-color: var(--brand-header-bg, var(--muted));
    aspect-ratio: 4 / 5;
  }
  .mj-tile-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 600ms cubic-bezier(.2,.6,.2,1);
  }
  .mj-tile:hover .mj-tile-img { transform: scale(1.025); }
  .mj-tile-cta-arrow {
    display: inline-block;
    transition: transform 250ms ease;
  }
  .mj-tile:hover .mj-tile-cta-arrow { transform: translateX(4px); }
`;

interface TileProps {
  to: string;
  image: string;
  imageAlt: string;
  title: string;
  teaser: string;
  cta: string;
}

function JourneyTile({ to, image, imageAlt, title, teaser, cta }: TileProps) {
  return (
    <Link to={to} className="mj-tile group">
      <div className="mj-tile-img-wrap">
        <img src={image} alt={imageAlt} className="mj-tile-img" loading="lazy" />
      </div>
      <h2
        className="mt-6 mb-3"
        style={{
          fontFamily: "var(--font-serif-display)",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: "clamp(28px, 3vw, 36px)",
          lineHeight: 1.1,
          color: "var(--brand-title-color, var(--foreground))",
        }}
      >
        {title}
      </h2>
      <p
        className="mb-5"
        style={{
          fontFamily: "var(--font-serif-body)",
          fontStyle: "italic",
          fontSize: 17,
          lineHeight: 1.6,
          color: "var(--muted-foreground)",
          maxWidth: 420,
        }}
      >
        “{teaser}”
      </p>
      <span
        style={{
          fontFamily: "var(--font-meta)",
          fontSize: 12,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--brand-olive, var(--muted-foreground))",
        }}
      >
        {cta} <span className="mj-tile-cta-arrow">→</span>
      </span>
    </Link>
  );
}

function MyJourneyHub() {
  return (
    <SiteLayoutWeb>
      <style>{tileStyles}</style>

      {/* HERO — tighter cream band */}
      <section
        className="w-full"
        style={{
          backgroundColor: "var(--brand-header-bg, var(--muted))",
          borderBottom: "1px solid var(--brand-header-border, var(--border))",
        }}
      >
        <div className="mx-auto max-w-[760px] px-6 py-14 sm:py-20 text-center">
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
            My Journey
          </p>
          <h1
            className="mb-6"
            style={{
              fontFamily: "var(--font-serif-display)",
              fontSize: "clamp(44px, 6.5vw, 76px)",
              fontStyle: "italic",
              fontWeight: 500,
              lineHeight: 1.05,
              color: "var(--brand-title-color, var(--foreground))",
            }}
          >
            My Journey
          </h1>
          <p
            className="mx-auto"
            style={{
              fontFamily: "var(--font-serif-body)",
              fontSize: 19,
              lineHeight: 1.6,
              color: "var(--foreground)",
              maxWidth: 560,
            }}
          >
            Two threads run through the life of Vaisesika Dasa — the personal search
            that brought him to bhakti as a teenager, and the teacher whose shelter
            shaped every step that followed.
          </p>
          <Dots />
        </div>
      </section>

      {/* TWO IMAGE-LED TILES */}
      <section style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-[960px] px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            <JourneyTile
              to="/my-journey/my-story"
              image={storyImage}
              imageAlt="Vaisesika Dasa in meditation in a forest clearing"
              title="My Story"
              teaser="The questions, search, and moments that shaped a life of bhakti."
              cta="Read My Story"
            />
            <JourneyTile
              to="/my-journey/my-guru"
              image={guruImage}
              imageAlt="Portrait of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada"
              title="My Guru"
              teaser="The teacher, shelter, and legacy at the heart of this journey."
              cta="Learn About My Guru"
            />
          </div>
        </div>
      </section>

      <ContactSection />
    </SiteLayoutWeb>
  );
}
