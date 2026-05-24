import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import { EventCard } from "@/components/event-card";
import { getPublishedDbPosts } from "@/lib/blog.functions";
import { getUpcomingEvents, type EventRow } from "@/lib/events.functions";
import { getAllPosts, formatDate } from "@/content/queries";
import type { Post } from "@/content/posts";

import storyImg from "@/assets/my-story/vaisesika-archway.jpg";
import guruImg from "@/assets/my-guru/prabhupada-portrait.jpg";
import heroStampBg from "@/assets/hero-stamp-background.png";
import vaisesikaPortrait from "@/assets/vaisesika-portrait.png";
import postServe from "@/assets/post-serve.jpg";

const YOUTUBE_URL = "https://www.youtube.com/c/FanTheSpark";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Fan The Spark — Home" },
      {
        name: "description",
        content:
          "Encouragement and support for expanding your book distribution, sadhana, and understanding of sastra — with Vaisesika Dasa.",
      },
      { property: "og:title", content: "Fan The Spark" },
      {
        property: "og:description",
        content:
          "Encouragement and support for expanding your book distribution, sadhana, and understanding of sastra.",
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
      <JourneySplit />
      {upcoming.length > 0 ? <UpcomingEvents events={upcoming} /> : null}
      <WisdomTeachings posts={latest} />
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
        backgroundColor: "#f2f0ea",
        backgroundImage: `url(${heroStampBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
        backgroundSize: "100% auto",
        paddingBottom: 80,
      }}
    >
      <div
        className="relative mx-auto flex flex-col items-center text-center px-6"
        style={{
          maxWidth: 760,
          paddingTop: "clamp(280px, 36vw, 460px)",
        }}
      >
        <h1 className="sr-only">Fan The Spark</h1>
        <p
          style={{
            fontFamily: "var(--font-serif-body)",
            fontSize: "clamp(16px, 1.4vw, 19px)",
            lineHeight: 1.6,
            color: "#6b6448",
            maxWidth: 620,
            marginBottom: 40,
          }}
        >
          Welcome to the Fan The Spark website where you will find
          encouragement and support for expanding your book distribution,
          sadhana, and understanding of sastra. Click the links below to learn
          more.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <HeroCTA to="/wisdom/lord" label="Lord Chaitanya" />
          <HeroCTA to="/my-journey/my-guru" label="Disciple of Srila Prabhupada" />
        </div>
      </div>
    </section>
  );
}

function HeroCTA({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="no-underline inline-block uppercase transition-opacity hover:opacity-90"
      style={{
        backgroundColor: "#e8623c",
        color: "#ffffff",
        padding: "18px 30px",
        fontFamily: "var(--font-meta)",
        fontSize: 12,
        letterSpacing: "0.22em",
        fontWeight: 600,
      }}
    >
      {label}
    </Link>
  );
}

/* ===================== QUICK LINKS ===================== */
function QuickLinks() {
  const items = [
    { to: "/next-steps/ask", title: "Ask Vaisesika Dasa" },
    { to: "/next-steps/small-groups", title: "Small Groups Near You" },
    { to: "/next-steps/spiritual-retreat", title: "Spiritual Retreats" },
    { to: "/serve", title: "Serve Selflessly" },
  ];
  return (
    <section style={{ padding: "96px 24px 60px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionEyebrow text="Start Here" />
        <div
          className="grid gap-px"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            background: "var(--border)",
            marginTop: 32,
          }}
        >
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="no-underline group"
              style={{
                backgroundColor: "var(--background)",
                padding: "40px 28px 44px",
                display: "block",
                borderBottom: "none",
                transition: "background-color 200ms ease",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-serif-display)",
                  fontSize: 24,
                  lineHeight: 1.2,
                  marginBottom: 18,
                  color: "var(--foreground)",
                }}
              >
                {it.title}
              </h3>
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

/* ===================== JOURNEY SPLIT ===================== */
function JourneySplit() {
  const tiles = [
    {
      to: "/my-journey/my-story",
      img: storyImg,
      eyebrow: "My Journey",
      title: "My Story",
      cta: "Read →",
    },
    {
      to: "/my-journey/my-guru",
      img: guruImg,
      eyebrow: "My Journey",
      title: "My Guru",
      cta: "Read →",
    },
  ];
  return (
    <section style={{ padding: "60px 24px 90px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div
          className="grid gap-6 md:gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}
        >
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
                    "linear-gradient(180deg, rgba(15,12,8,0.05) 0%, rgba(15,12,8,0.55) 70%, rgba(15,12,8,0.9) 100%)",
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
                    marginBottom: 16,
                  }}
                >
                  {t.title}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-meta)",
                    fontSize: 12,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#f8f1df",
                    borderBottom: "1px solid rgba(228,207,140,0.55)",
                    paddingBottom: 3,
                    alignSelf: "flex-start",
                  }}
                >
                  {t.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== UPCOMING EVENTS ===================== */
function UpcomingEvents({ events }: { events: EventRow[] }) {
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

/* ===================== WISDOM & TEACHINGS ===================== */
function WisdomTeachings({ posts }: { posts: Post[] }) {
  return (
    <section style={{ padding: "100px 24px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionEyebrow text="Wisdom & Teachings" />
        <h2
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: "clamp(34px, 4vw, 48px)",
            lineHeight: 1.1,
            color: "var(--foreground)",
            marginTop: 14,
            marginBottom: 56,
          }}
        >
          Wisdom &amp; Teachings
        </h2>

        {/* WATCH */}
        <SubsectionHeader
          label="Watch"
          ctaLabel="Watch More →"
          ctaHref={YOUTUBE_URL}
          external
        />
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            marginBottom: 80,
          }}
        >
          <YouTubeEmbed
            id="videoseries?list=UULFlKbqEU-IufWUuiBO_Z4FuQ"
            title="Latest from Fan The Spark on YouTube"
          />
        </div>

        {/* LISTEN */}
        <SubsectionHeader
          label="Listen"
          ctaLabel="Listen More →"
          ctaTo="/wisdom/audio-playlists"
        />
        <div style={{ marginBottom: 80 }}>
          <SoundCloudEmbed url="https://soundcloud.com/fan-the-spark" />
        </div>

        {/* READ */}
        <SubsectionHeader
          label="Read"
          ctaLabel="Read Articles →"
          ctaTo="/wisdom/blog"
        />
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
                    src={
                      typeof p.featuredImage.src === "string"
                        ? p.featuredImage.src
                        : (p.featuredImage.src as unknown as string)
                    }
                    alt={p.featuredImage.alt}
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
                    fontSize: 24,
                    lineHeight: 1.2,
                    color: "var(--foreground)",
                    marginBottom: 12,
                  }}
                >
                  {p.title}
                </h3>
                {p.excerpt ? (
                  <p
                    style={{
                      fontFamily: "var(--font-serif-body)",
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {p.excerpt}
                  </p>
                ) : null}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubsectionHeader({
  label,
  ctaLabel,
  ctaTo,
  ctaHref,
  external,
}: {
  label: string;
  ctaLabel: string;
  ctaTo?: string;
  ctaHref?: string;
  external?: boolean;
}) {
  const ctaStyle = {
    fontFamily: "var(--font-meta)",
    fontSize: 12,
    letterSpacing: "0.22em",
    color: "var(--primary)",
    borderBottom: "1px solid var(--primary)",
    paddingBottom: 2,
  } as const;
  return (
    <div className="flex items-end justify-between flex-wrap gap-4" style={{ marginBottom: 24 }}>
      <h3
        style={{
          fontFamily: "var(--font-serif-display)",
          fontStyle: "italic",
          fontSize: 28,
          lineHeight: 1.1,
          color: "var(--foreground)",
        }}
      >
        {label}
      </h3>
      {ctaHref && external ? (
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline uppercase"
          style={ctaStyle}
        >
          {ctaLabel}
        </a>
      ) : ctaTo ? (
        <Link to={ctaTo} className="no-underline uppercase" style={ctaStyle}>
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", backgroundColor: "var(--muted)" }}>
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>
  );
}

function SoundCloudEmbed({ url }: { url: string }) {
  const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    url,
  )}&color=%23c9a84c&inverse=false&auto_play=false&show_user=true`;
  return (
    <iframe
      title="Fan The Spark on SoundCloud"
      width="100%"
      height="300"
      scrolling="no"
      frameBorder="no"
      allow="autoplay"
      src={src}
      style={{ display: "block", border: 0 }}
    />
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
        <h2
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: "clamp(34px, 4.5vw, 54px)",
            lineHeight: 1.1,
            marginBottom: 40,
          }}
        >
          How Can I Be Of Service?
        </h2>
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
      cta: "Learn more →",
    },
    {
      to: "/serve/transformational-stories",
      img: postServe,
      eyebrow: "Stories",
      title: "Transformational Stories",
      cta: "Read stories →",
    },
  ];
  return (
    <section style={{ padding: "100px 24px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div
          className="grid gap-10 md:gap-14"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
        >
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
                  marginBottom: 16,
                }}
              >
                {t.title}
              </h3>
              <span
                style={{
                  fontFamily: "var(--font-meta)",
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--primary)",
                  borderBottom: "1px solid var(--primary)",
                  paddingBottom: 2,
                }}
              >
                {t.cta}
              </span>
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
