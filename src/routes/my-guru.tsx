import { createFileRoute } from "@tanstack/react-router";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import { ContactSection } from "@/components/contact-section";
import { Dots, Para, Prose } from "@/components/editorial";
import heroUrl from "@/assets/my-guru/prabhupada-hero.png";
import speakingUrl from "@/assets/my-guru/prabhupada-speaking.jpg";
import laughingUrl from "@/assets/my-guru/prabhupada-laughing.png";
import darshanUrl from "@/assets/my-guru/prabhupada-darshan.jpg";
import initiationUrl from "@/assets/my-guru/prabhupada-initiation.jpg";

export const Route = createFileRoute("/my-guru")({
  head: () => ({
    meta: [
      { title: "My Guru — Srila Prabhupada · Fan The Spark" },
      {
        name: "description",
        content:
          "His Divine Grace A.C. Bhaktivedanta Swami Prabhupada (1896–1977) — founder of ISKCON and the pre-eminent exponent of Bhakti-yoga to the Western world.",
      },
      { property: "og:title", content: "My Guru — Srila Prabhupada" },
      {
        property: "og:description",
        content:
          "The life and legacy of Srila Prabhupada — founder of ISKCON, author of seventy volumes on Bhakti, and guru of Vaisesika Dasa.",
      },
      { property: "og:image", content: heroUrl },
    ],
  }),
  component: MyGuruPage,
});

const heroImageStyles = `
  .my-guru-hero-image {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 5;
    height: auto;
    max-height: 580px;
    object-fit: cover;
    object-position: 50% 35%;
  }

  @media (min-width: 1024px) {
    .my-guru-hero-image {
      aspect-ratio: auto;
      height: auto;
      max-height: min(72vh, 780px);
      object-fit: cover;
      object-position: center 30%;
    }
  }
`;

function MyGuruPage() {
  return (
    <SiteLayoutWeb>
      <style>{heroImageStyles}</style>

      {/* HERO */}
      <section className="relative w-full" style={{ backgroundColor: "#14110a" }}>
        <img
          src={heroUrl}
          alt="Srila Prabhupada seated in a forest, garlanded with marigolds"
          className="my-guru-hero-image"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1200px] px-6 pb-8 sm:pb-12">
            <div className="max-w-[620px]">
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
                  textShadow:
                    "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.45)",
                }}
              >
                My Guru
              </h1>
              <p
                className="mt-4"
                style={{
                  fontFamily: "var(--font-meta)",
                  fontSize: 13,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#fef9e9",
                  textShadow: "0 1px 8px rgba(0,0,0,0.55)",
                }}
              >
                His Divine Grace A. C. Bhaktivedanta Swami Prabhupada · 1896–1977
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD */}
      <Prose tight="bottom">
        <Dots />
        <Para>
          His Divine Grace A.C. Bhaktivedanta Swami Prabhupada (1896–1977), guru of
          Vaisesika Dasa, is widely regarded as the world’s pre-eminent exponent of the
          teachings and practices of Bhakti-yoga to the Western world. He is the{" "}
          <a
            href="http://www.founderacharya.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--brand-title-color)" }}
          >
            Founder-Acarya
          </a>{" "}
          of the International Society for Krishna Consciousness (ISKCON).
        </Para>
      </Prose>

      {/* EARLY LIFE */}
      <Prose tight="both">
        <Para>
          Born Abhay Charan De on September 1, 1896, in Calcutta, as a youth he became
          involved with Mahatma Gandhi’s civil disobedience movement. It was, however, a
          meeting with a prominent scholar and spiritual leader, Srila Bhaktisiddhanta
          Sarasvati, which proved most influential on young Abhay’s future calling. Upon
          their first meeting Srila Bhaktisiddhanta, who represented an ancient tradition
          of Bhakti (devotional yoga), asked Abhay to bring the teachings of Krishna to
          the English-speaking world. From birth, Abhay had been raised in a family
          devoted to Krishna – the name meaning the all-attractive, all-loving Lord.
          Deeply moved by Srila Bhaktisiddhanta’s devotion and wisdom, Abhay became his
          disciple and dedicated himself to carrying out his mentor’s request. But it
          wasn’t until 1965, at the age of seventy, that he would set off on his mission
          to the West.
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
            maxWidth: 620,
          }}
        >
          “Bring the teachings of Krishna to the English-speaking world.”
          <span
            className="block mt-4"
            style={{
              fontFamily: "var(--font-meta)",
              fontStyle: "normal",
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
            }}
          >
            — Srila Bhaktisiddhanta Sarasvati, to young Abhay
          </span>
        </blockquote>

        <Para>
          Having since been awarded the honorary title of Bhaktivedanta in recognition of
          his learning and devotion, and having taken the vows of sannyasa (renunciation),
          Abhay Charan, now known as Bhaktivedanta Swami, begged free passage and boarded
          a cargo ship to New York. The journey proved to be treacherous, and the elderly
          spiritual teacher suffered two heart attacks aboard ship. After 35 days at sea
          he finally arrived at a lonely Brooklyn pier with just seven dollars in Indian
          rupees and a crate of his translations of sacred Sanskrit texts.
        </Para>
      </Prose>

      {/* FULL-BLEED PHOTO */}
      <section className="w-full">
        <img
          src={speakingUrl}
          alt="Srila Prabhupada speaking, garlanded with marigolds"
          className="block w-full h-auto"
          style={{ maxHeight: "82vh", objectFit: "cover", objectPosition: "center 30%" }}
        />
      </section>

      {/* NEW YORK */}
      <Prose tight="top">
        <Para>
          In New York he faced great hardships without money or a place to live. He began
          his mission humbly, by giving classes on the Bhagavad-gita in lofts on the
          Bowery, New York’s infamous skid row, and leading kirtan (traditional devotional
          chants) in Tompkins Square Park. His message of peace and goodwill resonated
          with many young people, some of whom came forward to become serious students of
          the Krishna-bhakti tradition. With the help of these students, Bhaktivedanta
          Swami rented a small storefront on New York’s Lower East Side to use as a
          temple. After months of hardship and struggle, in July of 1966, Bhaktivedanta
          Swami established the International Society for Krishna Consciousness for the
          purpose of checking the imbalance of values in the world and working for real
          unity and peace. He taught that each soul is part and parcel of the quality of
          God and that one could find true happiness through living a simpler, more
          natural way of life and dedicating one’s energy in the service of God and all
          living beings.
        </Para>
      </Prose>

      {/* TWO-UP PHOTO ROW */}
      <section className="w-full" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-[1200px] px-6 pb-10 sm:pb-14">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <img
              src={laughingUrl}
              alt="Srila Prabhupada laughing among disciples"
              className="block w-full h-auto"
              style={{ maxHeight: 560, objectFit: "cover", borderRadius: 2 }}
            />
            <img
              src={darshanUrl}
              alt="Srila Prabhupada giving darshan, seated amid rose petals"
              className="block w-full h-auto"
              style={{ maxHeight: 560, objectFit: "cover", borderRadius: 2 }}
            />
          </div>
        </div>
      </section>

      {/* SAN FRANCISCO + GLOBAL */}
      <Prose tight="top">
        <Para>
          Having begun initiating his American followers into the Gaudiya Vaishnava
          lineage, Bhaktivedanta Swami next traveled to San Francisco. Amidst the emerging
          hippie community in the Haight-Ashbury district, during 1967’s “Summer of Love”
          he taught that the experience of devotion through kirtan was a spiritual “high”
          superior to any pleasures derived from material sources such as wealth, fame, or
          intoxication. In the following months many more came forward to assist him.
          Desiring to address him with the respect due a revered spiritual teacher, his
          disciples began to call him Srila Prabhupada, meaning “one at whose feet the
          masters sit”.
        </Para>

        <Para>
          In the eleven years that followed, Srila Prabhupada circled the globe fourteen
          times, bringing the teachings of Bhakti to thousands of people on six
          continents. Men and women from all backgrounds came forward to accept his
          message. With their help, Srila Prabhupada established centres and projects
          throughout the world including temples, rural communities, educational
          institutions, and what would become the world’s largest vegetarian food relief
          program. With the desire to nourish the roots of Krishna-bhakti in its home,
          Srila Prabhupada returned to India several times, where he sparked a revival in
          the Bhakti tradition. In India, he opened dozens of temples, including important
          centres in the holy towns of Vrindavana and Mayapur.
        </Para>
      </Prose>

      {/* FULL-BLEED INITIATION PHOTO */}
      <section className="w-full">
        <img
          src={initiationUrl}
          alt="Srila Prabhupada offering initiation beads to a disciple, surrounded by devotees"
          className="block w-full h-auto"
          style={{ maxHeight: "88vh", objectFit: "cover", objectPosition: "center 35%" }}
        />
      </section>

      {/* BOOKS + LEGACY */}
      <Prose>
        <Para>
          Perhaps Srila Prabhupada’s most significant contribution is his books. He
          authored over seventy volumes on Bhakti-yoga, which are highly respected for
          their authority, depth, clarity, and fidelity to tradition. His writings have
          been translated into seventy-six languages. His most prominent works include:
          Bhagavad-gita As It Is, the thirty-volume Srimad-Bhagavatam, and the
          seventeen-volume Sri Caitanya-caritamrita.
        </Para>

        <Para>
          For millennia the teachings of Bhakti-yoga had been concealed within Sanskrit
          and Indian vernacular languages, and the rich culture of Bhakti had been hidden
          behind the borders of India. Today, millions around the globe express their
          gratitude to Srila Prabhupada for revealing the timeless wisdom of Bhakti to a
          world immersed in a materialistic and self-destructive ethos.
        </Para>

        <p
          className="mt-10 mb-2 text-center"
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: "clamp(22px, 2.6vw, 28px)",
            lineHeight: 1.45,
            color: "var(--brand-title-color)",
          }}
        >
          A. C. Bhaktivedanta Swami Prabhupada passed away on November 14, 1977, in the
          holy town of Vrindaban, surrounded by his loving disciples who carry on his
          mission today.
        </p>

        <Dots />
      </Prose>

      <ContactSection />
    </SiteLayoutWeb>
  );
}
