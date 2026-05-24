import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import { EventCard } from "@/components/event-card";
import { getPublishedDbPosts } from "@/lib/blog.functions";
import { getUpcomingEvents } from "@/lib/events.functions";
import { getAllPosts, formatDate } from "@/content/queries";
import type { Post } from "@/content/posts";

import heroImg from "@/assets/my-story/prabhupada-with-devotees.jpg";
import storyImg from "@/assets/my-story/vaisesika-archway.jpg";
import guruImg from "@/assets/my-guru/prabhupada-portrait.jpg";
import stamp from "@/assets/fts-logo-stamp-hero.png";
import vaisesikaPortrait from "@/assets/vaisesika-portrait.png";
import postFamilyBusiness from "@/assets/post-family-business.jpg";
import postFourQuestions from "@/assets/post-four-questions.jpg";
import postServe from "@/assets/post-serve.jpg";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Fan The Spark — Home" },
      {
        name: "description",
        content:
          "A quiet place for hearing, chanting, and remembering Krishna — essays, talks, retreats, and small ways to serve, with Vaisesika Dasa.",
      },
      { property: "og:title", content: "Fan The Spark" },
      {
        property: "og:description",
        content:
          "Sprinkling the water of hearing and chanting — long-form bhakti essays, retreats, and small ways to serve.",
      },
    ],
  }),
  loader: async () => {
    const [posts, upcoming] = await Promise.all([
      getPublishedDbPosts(),
      getUpcomingEvents({ data: { limit: 3 } }),
    ]);
    return { posts, upcoming };
  },
  component: HomePage,
});

function mergePosts(dbPosts: Post[]): Post[] {
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const staticPosts = getAllPosts().filter((p) => !dbSlugs.has(p.slug));
  return [...dbPosts, ...staticPosts].sort((a, b) => b.date.localeCompare(a.date));
}

function HomePage() {
  const initial = Route.useLoaderData();
  const fetchPosts = useServerFn(getPublishedDbPosts);
  const { data: dbPosts = initial.posts } = useQuery({
    queryKey: ["published-posts"],
    queryFn: () => fetchPosts(),
    initialData: initial.posts,
  });
  const all = mergePosts(dbPosts);
  const latest = all.filter((p) => p.category !== "Books").slice(0, 3);
  const upcoming = initial.upcoming;

  return (
    <SiteLayoutWeb>
      <Hero />
      <QuickLinks />
      <LatestArticles posts={latest} />
      <JourneySplit />
      {upcoming.length > 0 ? <UpcomingEvents events={upcoming} /> : null}
      <WatchListen />
      <BooksResources allPosts={all} />
      <ServeBand />
      <ServantStories />
    </SiteLayoutWeb>
  );
}

/* ===================== HERO ===================== */
function Hero() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "min(90vh, 780px)",
        overflow: "hidden",
        backgroundColor: "#0e0c08",
      }}
    >
      <img
        src={heroImg}
        alt="Srila Prabhupada with devotees"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
          opacity: 0.78,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(15,12,8,0.55) 0%, rgba(15,12,8,0.25) 35%, rgba(15,12,8,0.85) 100%)",
        }}
      />
      <div
        className="relative mx-auto flex flex-col justify-end px-6"
        style={{
          maxWidth: 1200,
          minHeight: "min(90vh, 780px)",
          paddingTop: 120,
          paddingBottom: 96,
          color: "#f8f1df",
        }}
      >
        <img
          src={stamp}
          alt=""
          style={{ width: 84, height: "auto", opacity: 0.92, marginBottom: 28 }}
        />
        <p
          style={{
            fontFamily: "var(--font-meta)",
            fontSize: 12,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#e4cf8c",
            marginBottom: 18,
          }}
        >
          Fan The Spark · with Vaisesika Dasa
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif-display)",
            fontSize: "clamp(40px, 6vw, 78px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            color: "#f8f1df",
            maxWidth: 880,
            marginBottom: 26,
          }}
        >
          Sprinkling the water of{" "}
          <em style={{ fontStyle: "italic", color: "#f0d997" }}>hearing</em> and{" "}
          <em style={{ fontStyle: "italic", color: "#f0d997" }}>chanting</em>.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-serif-body)",
            fontSize: 18,
            lineHeight: 1.7,
            color: "rgba(248,241,223,0.82)",
            maxWidth: 620,
            marginBottom: 38,
          }}
        >
          A quiet place to slow down, read a little, chant a little, and remember
          what matters — guided by the teachings of Srila Prabhupada and his
          student, Vaisesika Dasa.
        </p>
        <div className="flex flex-wrap gap-4">
          <HeroCTA to="/wisdom/blog" label="Read the blog" primary />
          <HeroCTA to="/my-journey/my-story" label="My story" />
        </div>
      </div>
    </section>
  );
}

function HeroCTA({ to, label, primary }: { to: string; label: string; primary?: boolean }) {
  const style = primary
    ? {
        backgroundColor: "#e4cf8c",
        color: "#241a08",
        border: "1px solid #e4cf8c",
      }
    : {
        backgroundColor: "transparent",
        color: "#f8f1df",
        border: "1px solid rgba(248,241,223,0.45)",
      };
  return (
    <Link
      to={to}
      className="no-underline inline-block uppercase transition-opacity hover:opacity-90"
      style={{
        ...style,
        padding: "16px 28px",
        fontFamily: "var(--font-meta)",
        fontSize: 12,
        letterSpacing: "0.22em",
        borderBottom: style.border,
      }}
    >
      {label}
    </Link>
  );
}

/* ===================== QUICK LINKS ===================== */
function QuickLinks() {
  const items = [
    {
      to: "/next-steps/ask",
      kicker: "Begin a conversation",
      title: "Ask Vaisesika Dasa",
      blurb: "Send a question and receive a thoughtful reply.",
    },
    {
      to: "/next-steps/small-groups",
      kicker: "Find your sangha",
      title: "Small Groups",
      blurb: "Gather with practitioners near you for hearing & chanting.",
    },
    {
      to: "/next-steps/spiritual-retreat",
      kicker: "Step away",
      title: "Spiritual Retreats",
      blurb: "A few days of practice, simplicity, and shared silence.",
    },
    {
      to: "/serve",
      kicker: "Take part",
      title: "Serve Selflessly",
      blurb: "Small, daily ways to help the work go forward.",
    },
  ];
  return (
    <section style={{ padding: "96px 24px 60px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionEyebrow text="Start Here" />
        <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", background: "var(--border)", marginTop: 32 }}>
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="no-underline group"
              style={{
                backgroundColor: "var(--background)",
                padding: "32px 28px 36px",
                display: "block",
                borderBottom: "none",
                transition: "background-color 200ms ease",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-meta)",
                  fontSize: 10,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--brand-olive, var(--muted-foreground))",
                  marginBottom: 12,
                }}
              >
                {it.kicker}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-serif-display)",
                  fontSize: 26,
                  lineHeight: 1.15,
                  marginBottom: 10,
                  color: "var(--foreground)",
                }}
              >
                {it.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-serif-body)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "var(--muted-foreground)",
                  marginBottom: 18,
                }}
              >
                {it.blurb}
              </p>
              <span
                style={{
                  display: "inline-block",
                  width: 28,
                  height: 1,
                  backgroundColor: "var(--brand-gold, #c9a84c)",
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== LATEST ARTICLES ===================== */
function LatestArticles({ posts }: { posts: Post[] }) {
  return (
    <section style={{ padding: "80px 24px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <SectionEyebrow text="From the blog" />
            <h2
              style={{
                fontFamily: "var(--font-serif-display)",
                fontStyle: "italic",
                fontSize: "clamp(34px, 4vw, 48px)",
                lineHeight: 1.1,
                color: "var(--foreground)",
                marginTop: 14,
              }}
            >
              Recent essays
            </h2>
          </div>
          <Link
            to="/wisdom/blog"
            className="no-underline uppercase"
            style={{
              fontFamily: "var(--font-meta)",
              fontSize: 12,
              letterSpacing: "0.22em",
              color: "var(--primary)",
              borderBottom: "1px solid var(--primary)",
              paddingBottom: 2,
            }}
          >
            All essays →
          </Link>
        </div>
        <div
          className="grid gap-10"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {posts.map((p) => (
            <article key={p.slug}>
              <Link
                to="/wisdom/blog/$slug"
                params={{ slug: p.slug }}
                className="no-underline block"
                style={{ borderBottom: "none" }}
              >
                <div
                  style={{
                    aspectRatio: "4 / 3",
                    overflow: "hidden",
                    backgroundColor: "var(--muted)",
                    marginBottom: 20,
                  }}
                >
                  <img
                    src={typeof p.featuredImage.src === "string" ? p.featuredImage.src : (p.featuredImage.src as unknown as string)}
                    alt={p.featuredImage.alt}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 600ms ease",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-meta)",
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--brand-olive, var(--muted-foreground))",
                    marginBottom: 10,
                  }}
                >
                  {p.category} · {formatDate(p.date)}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-serif-display)",
                    fontSize: 26,
                    lineHeight: 1.2,
                    color: "var(--foreground)",
                    marginBottom: 12,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-serif-body)",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "var(--muted-foreground)",
                    marginBottom: 14,
                  }}
                >
                  {p.excerpt}
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-meta)",
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                  }}
                >
                  Read more →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== JOURNEY SPLIT ===================== */
function JourneySplit() {
  const tiles = [
    {
      to: "/my-journey/my-story",
      img: storyImg,
      eyebrow: "My Journey",
      title: "My Story",
      blurb: "How a quiet boy from California came to chant Krishna's names.",
    },
    {
      to: "/my-journey/my-guru",
      img: guruImg,
      eyebrow: "My Journey",
      title: "My Guru",
      blurb: "His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada.",
    },
  ];
  return (
    <section style={{ padding: "60px 24px 90px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div className="grid gap-6 md:gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
          {tiles.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="no-underline group block relative overflow-hidden"
              style={{ borderBottom: "none", aspectRatio: "4 / 3", backgroundColor: "#0e0c08" }}
            >
              <img
                src={t.img}
                alt={t.title}
                loading="lazy"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  opacity: 0.85,
                  transition: "transform 700ms ease, opacity 400ms ease",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(15,12,8,0.05) 0%, rgba(15,12,8,0.55) 70%, rgba(15,12,8,0.85) 100%)",
                }}
              />
              <div
                className="absolute inset-0 flex flex-col justify-end"
                style={{ padding: "36px 36px 40px", color: "#f8f1df" }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-meta)",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#e4cf8c",
                    marginBottom: 12,
                  }}
                >
                  {t.eyebrow}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-serif-display)",
                    fontStyle: "italic",
                    fontSize: 42,
                    lineHeight: 1.05,
                    marginBottom: 10,
                  }}
                >
                  {t.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-serif-body)",
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "rgba(248,241,223,0.85)",
                    maxWidth: 420,
                  }}
                >
                  {t.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== UPCOMING EVENTS ===================== */
function UpcomingEvents({ events }: { events: ReturnType<typeof useEvents> }) {
  return (
    <section
      style={{
        padding: "90px 24px",
        backgroundColor: "color-mix(in oklab, var(--brand-olive, var(--muted)) 8%, var(--background))",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <SectionEyebrow text="Gather" />
            <h2
              style={{
                fontFamily: "var(--font-serif-display)",
                fontStyle: "italic",
                fontSize: "clamp(34px, 4vw, 48px)",
                lineHeight: 1.1,
                color: "var(--foreground)",
                marginTop: 14,
              }}
            >
              Upcoming events
            </h2>
          </div>
          <Link
            to="/events"
            className="no-underline uppercase"
            style={{
              fontFamily: "var(--font-meta)",
              fontSize: 12,
              letterSpacing: "0.22em",
              color: "var(--primary)",
              borderBottom: "1px solid var(--primary)",
              paddingBottom: 2,
            }}
          >
            All events →
          </Link>
        </div>
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {events.map((e) => (
            <EventCard key={e.id} event={e} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
// helper type alias so the prop type stays readable
type EventList = Awaited<ReturnType<typeof getUpcomingEvents>>;
function useEvents(): EventList {
  return [] as unknown as EventList;
}

/* ===================== WATCH & LISTEN ===================== */
function WatchListen() {
  const tiles = [
    {
      href: "https://www.youtube.com/c/FanTheSpark",
      external: true,
      eyebrow: "Watch",
      title: "Talks on YouTube",
      blurb: "Class recordings, kirtans, and Q&A sessions on the FanTheSpark channel.",
      cta: "Visit channel ↗",
    },
    {
      to: "/wisdom/audio-playlists",
      eyebrow: "Listen",
      title: "Audio Playlists",
      blurb: "Curated talks for the commute, the kitchen, the morning walk.",
      cta: "Browse playlists →",
    },
    {
      href: "https://podcasts.apple.com/us/podcast/fan-the-spark/id1153081672",
      external: true,
      eyebrow: "Subscribe",
      title: "On Apple Podcasts",
      blurb: "Subscribe to Fan The Spark on iTunes / Apple Podcasts.",
      cta: "Open in Apple ↗",
    },
  ];
  return (
    <section style={{ padding: "90px 24px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionEyebrow text="Hear & See" />
        <h2
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: "clamp(34px, 4vw, 48px)",
            lineHeight: 1.1,
            color: "var(--foreground)",
            marginTop: 14,
            marginBottom: 40,
          }}
        >
          Watch &amp; Listen
        </h2>
        <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", background: "var(--border)" }}>
          {tiles.map((t) => {
            const inner = (
              <>
                <p
                  style={{
                    fontFamily: "var(--font-meta)",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "var(--brand-olive, var(--muted-foreground))",
                    marginBottom: 14,
                  }}
                >
                  {t.eyebrow}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-serif-display)",
                    fontSize: 28,
                    lineHeight: 1.15,
                    marginBottom: 12,
                    color: "var(--foreground)",
                  }}
                >
                  {t.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-serif-body)",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "var(--muted-foreground)",
                    marginBottom: 20,
                  }}
                >
                  {t.blurb}
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-meta)",
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                  }}
                >
                  {t.cta}
                </span>
              </>
            );
            const style = {
              backgroundColor: "var(--background)",
              padding: "40px 32px",
              display: "block",
              borderBottom: "none",
              height: "100%",
            } as const;
            return t.external ? (
              <a key={t.title} href={t.href} target="_blank" rel="noopener noreferrer" className="no-underline" style={style}>
                {inner}
              </a>
            ) : (
              <Link key={t.title} to={t.to!} className="no-underline" style={style}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===================== BOOKS & RESOURCES ===================== */
function BooksResources({ allPosts }: { allPosts: Post[] }) {
  const books = [
    {
      slug: "our-family-business",
      title: "Our Family Business",
      img: postFamilyBusiness,
      fallback:
        "A small book on building a household whose primary trade is devotion — cooking, reading aloud, chanting together, welcoming guests.",
      buyHref: "https://www.amazon.com/Our-Family-Business-Vaisesika-Dasa/dp/9171499008",
    },
    {
      slug: "the-four-questions",
      title: "The Four Questions",
      img: postFourQuestions,
      fallback:
        "Four small inquiries the Vedic tradition has handed down for centuries — who am I, where did I come from, what am I to do, where am I going.",
      buyHref: "https://thefourquestionsbook.com/",
    },
  ];

  return (
    <section
      style={{
        padding: "100px 24px",
        backgroundColor: "color-mix(in oklab, var(--brand-olive, var(--muted)) 10%, var(--background))",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionEyebrow text="Books & Resources" />
        <h2
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: "clamp(34px, 4vw, 48px)",
            lineHeight: 1.1,
            color: "var(--foreground)",
            marginTop: 14,
            marginBottom: 48,
            maxWidth: 720,
          }}
        >
          Slow, careful books on a devotional life.
        </h2>
        <div className="grid gap-10 md:gap-14" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          {books.map((b) => {
            const post = allPosts.find((p) => p.slug === b.slug);
            const blurb = post?.excerpt ?? b.fallback;
            return (
              <article key={b.slug} className="grid gap-8" style={{ gridTemplateColumns: "minmax(120px, 200px) 1fr", alignItems: "start" }}>
                <Link to="/wisdom/blog/$slug" params={{ slug: b.slug }} className="no-underline" style={{ borderBottom: "none" }}>
                  <img
                    src={b.img}
                    alt={b.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                    }}
                  />
                </Link>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-meta)",
                      fontSize: 10,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "var(--brand-olive, var(--muted-foreground))",
                      marginBottom: 12,
                    }}
                  >
                    Book
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif-display)",
                      fontStyle: "italic",
                      fontSize: 32,
                      lineHeight: 1.1,
                      color: "var(--foreground)",
                      marginBottom: 16,
                    }}
                  >
                    {b.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-serif-body)",
                      fontSize: 16,
                      lineHeight: 1.7,
                      color: "var(--muted-foreground)",
                      marginBottom: 22,
                    }}
                  >
                    {blurb}
                  </p>
                  <div className="flex flex-wrap gap-5 items-center">
                    <Link
                      to="/wisdom/blog/$slug"
                      params={{ slug: b.slug }}
                      className="no-underline uppercase"
                      style={{
                        fontFamily: "var(--font-meta)",
                        fontSize: 12,
                        letterSpacing: "0.22em",
                        color: "var(--primary)",
                        borderBottom: "1px solid var(--primary)",
                        paddingBottom: 2,
                      }}
                    >
                      Reading companion →
                    </Link>
                    <a
                      href={b.buyHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline uppercase"
                      style={{
                        fontFamily: "var(--font-meta)",
                        fontSize: 12,
                        letterSpacing: "0.22em",
                        color: "var(--muted-foreground)",
                        borderBottom: "1px solid var(--border)",
                        paddingBottom: 2,
                      }}
                    >
                      Get the book ↗
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===================== SERVE BAND ===================== */
function ServeBand() {
  const links = [
    { to: "/serve/give", label: "Give" },
    { to: "/serve/volunteer", label: "Volunteer" },
    { to: "/serve/servant-leaders", label: "Servant Leaders" },
  ];
  return (
    <section
      style={{
        padding: "100px 24px",
        backgroundColor: "#1f1a10",
        color: "#f8f1df",
      }}
    >
      <div className="mx-auto text-center" style={{ maxWidth: 820 }}>
        <p
          style={{
            fontFamily: "var(--font-meta)",
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#e4cf8c",
            marginBottom: 22,
          }}
        >
          How can I be of service?
        </p>
        <h2
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: "clamp(34px, 4.5vw, 54px)",
            lineHeight: 1.1,
            marginBottom: 28,
          }}
        >
          Small, daily ways to help the work go forward.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-serif-body)",
            fontSize: 17,
            lineHeight: 1.75,
            color: "rgba(248,241,223,0.78)",
            marginBottom: 36,
          }}
        >
          Whether by giving, volunteering, or leading a small group near you —
          every quiet act of service fans someone else's spark.
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="no-underline uppercase"
              style={{
                fontFamily: "var(--font-meta)",
                fontSize: 12,
                letterSpacing: "0.24em",
                color: "#f8f1df",
                borderBottom: "1px solid rgba(228,207,140,0.55)",
                paddingBottom: 3,
              }}
            >
              {l.label} →
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== SERVANT LEADERS + STORIES ===================== */
function ServantStories() {
  const tiles = [
    {
      to: "/serve/servant-leaders",
      img: vaisesikaPortrait,
      eyebrow: "Community",
      title: "Servant Leaders",
      blurb: "The people quietly carrying the work in their cities and homes.",
    },
    {
      to: "/serve/transformational-stories",
      img: postServe,
      eyebrow: "Stories",
      title: "Transformational Stories",
      blurb: "Honest accounts from practitioners whose lives have changed.",
    },
  ];
  return (
    <section style={{ padding: "100px 24px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div className="grid gap-10 md:gap-14" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          {tiles.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="no-underline block group"
              style={{ borderBottom: "none" }}
            >
              <div
                style={{
                  aspectRatio: "4 / 3",
                  overflow: "hidden",
                  backgroundColor: "var(--muted)",
                  marginBottom: 22,
                }}
              >
                <img
                  src={t.img}
                  alt={t.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: "var(--font-meta)",
                  fontSize: 11,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--brand-olive, var(--muted-foreground))",
                  marginBottom: 10,
                }}
              >
                {t.eyebrow}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-serif-display)",
                  fontStyle: "italic",
                  fontSize: 32,
                  lineHeight: 1.1,
                  color: "var(--foreground)",
                  marginBottom: 12,
                }}
              >
                {t.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-serif-body)",
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "var(--muted-foreground)",
                  maxWidth: 460,
                }}
              >
                {t.blurb}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== Shared bits ===================== */
function SectionEyebrow({ text }: { text: string }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-meta)",
        fontSize: 11,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "var(--brand-olive, var(--muted-foreground))",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 28,
          height: 1,
          backgroundColor: "var(--brand-gold, #c9a84c)",
        }}
      />
      {text}
    </p>
  );
}
