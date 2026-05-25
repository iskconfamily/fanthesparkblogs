import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import { EventCard } from "@/components/event-card";
import { getPublishedDbPosts } from "@/lib/blog.functions";
import { getUpcomingEvents, type EventRow } from "@/lib/events.functions";
import { getLatestVideos } from "@/lib/youtube.functions";
import { getAllPosts, getPostBySlug, formatDate } from "@/content/queries";
import type { Post } from "@/content/posts";
import { TestimonialsRow, TESTIMONIALS } from "@/components/testimonials-row";

import storyImg from "@/assets/vaisesika-dasa-portrait.jpg";
import guruImg from "@/assets/my-story/prabhupada-group.jpg";
import heroCrowdBg from "@/assets/hero-crowd-bg.png";
import heroStamp from "@/assets/hero-stamp.png";
import transformationStoriesImg from "@/assets/transformational-stories.jpg";


const YOUTUBE_URL = "https://www.youtube.com/@FanTheSpark";
const FALLBACK_VIDEO_IDS = ["fgro2YbO8FI", "YYrcIfSkyNw", "oAKRerWbcCw", "brkI26UXWrg"];

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
    const [posts, upcoming, videoIds] = await Promise.all([
      getPublishedDbPosts(),
      getUpcomingEvents({ data: { limit: 3 } }),
      getLatestVideos(),
    ]);
    return { posts, upcoming, videoIds: videoIds.length ? videoIds : FALLBACK_VIDEO_IDS };
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
      <MyGuruFeature />
      <LatestVideos videoIds={initial.videoIds} />
      <LatestAudio />
      <LatestWritings posts={latest} />
      <MyStoryFeature />
      <BooksFeature />
      {upcoming.length > 0 ? <UpcomingEvents events={upcoming} /> : null}

      <ServeBand />
      <StoriesAndTestimonials />
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
        backgroundImage: `url(${heroCrowdBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        backgroundSize: "100% auto",
        paddingBottom: 100,
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#f2f0ea",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <div
        className="relative mx-auto flex justify-center"
        style={{ paddingTop: 56 }}
      >
        <img
          src={heroStamp}
          alt="Fan The Spark"
          style={{
            width: "clamp(300px, 38vw, 460px)",
            height: "auto",
            display: "block",
          }}
        />
      </div>
      <div
        className="relative mx-auto flex flex-col items-center text-center"
        style={{
          maxWidth: 760,
          padding: "32px 24px 0",
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
            margin: "0 auto 32px",
          }}
        >
          Welcome to the Fan The Spark website where you will find
          encouragement and support for expanding your book distribution,
          sadhana, and understanding of sastra. Click the links below to learn
          more.
        </p>
        <div className="flex flex-col w-full max-w-[300px] mx-auto gap-3 sm:flex-row sm:max-w-none sm:w-auto sm:gap-4">
          <HeroCTA to="/wisdom/lord" label="Lord Chaitanya" />
          <HeroCTA
            to="/my-journey/my-guru"
            label="Disciple of Srila Prabhupada"
          />
        </div>
      </div>
    </section>
  );
}

function HeroCTA({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="no-underline inline-block uppercase w-full sm:w-auto text-center sm:whitespace-nowrap"
      style={{
        backgroundColor: "#faf2e8",
        color: "#c2542a",
        border: "1px solid #e8623c",
        padding: "16px 28px",
        fontFamily: "var(--font-meta)",
        fontSize: 12,
        letterSpacing: "0.22em",
        fontWeight: 600,
        transition: "background-color 200ms ease, color 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#e8623c";
        e.currentTarget.style.color = "#ffffff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#faf2e8";
        e.currentTarget.style.color = "#c2542a";
      }}
    >
      {label}
    </Link>
  );
}

/* ===================== QUICK LINKS ===================== */
import { MessageCircle, Users, Sparkles, HandHeart } from "lucide-react";

function QuickLinks() {
  const items = [
    { to: "/next-steps/ask", title: "Ask Vaisesika Dasa", Icon: MessageCircle },
    { to: "/next-steps/small-groups", title: "Small Groups Near You", Icon: Users },
    { to: "/next-steps/spiritual-retreat", title: "Spiritual Retreats", Icon: Sparkles },
    { to: "/serve", title: "Serve Selflessly", Icon: HandHeart },
  ];
  const gold = "var(--brand-gold, #c9a84c)";
  const borderCol = "rgba(201,168,76,0.18)";
  return (
    <section style={{ padding: "96px 24px 60px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionEyebrow text="Start Here" />
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            marginTop: 40,
            borderTop: `1px solid ${borderCol}`,
            borderBottom: `1px solid ${borderCol}`,
          }}
        >
          {items.map((it, idx) => (
            <Link
              key={it.to}
              to={it.to}
              className="no-underline quick-link-card"
              style={{
                padding: "48px 28px 44px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                borderLeft: idx === 0 ? "none" : `1px solid ${borderCol}`,
                transition: "background-color 400ms ease",
              }}
            >
              <span className="quick-link-icon" style={{ marginBottom: 22, color: gold, display: "inline-flex", transition: "transform 500ms ease" }}>
                <it.Icon size={32} strokeWidth={1} />
              </span>
              <h3
                className="quick-link-title"
                style={{
                  fontFamily: "var(--font-serif-display)",
                  fontSize: 22,
                  lineHeight: 1.25,
                  marginBottom: 18,
                  color: "var(--foreground)",
                  transition: "color 300ms ease",
                }}
              >
                {it.title}
              </h3>
              <span
                className="quick-link-rule"
                style={{
                  display: "inline-block",
                  width: 24,
                  height: 1,
                  backgroundColor: gold,
                  transition: "width 500ms ease",
                }}
              />
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .quick-link-card:hover { background-color: rgba(255,255,255,0.55); }
        .quick-link-card:hover .quick-link-icon { transform: scale(1.1); }
        .quick-link-card:hover .quick-link-title { color: var(--brand-gold, #c9a84c); }
        .quick-link-card:hover .quick-link-rule { width: 64px; }
      `}</style>
    </section>
  );
}


/* ===================== JOURNEY SPLIT (My Guru | My Story) ===================== */
function JourneySplit() {
  const tiles = [
    {
      to: "/my-journey/my-guru",
      img: guruImg,
      eyebrow: "My Journey",
      title: "My Guru",
      cta: "Read →",
      objectPosition: "center 28%",
    },
    {
      to: "/my-journey/my-story",
      img: storyImg,
      eyebrow: "My Journey",
      title: "My Story",
      cta: "Read →",
      objectPosition: "center 30%",
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
              style={{ borderBottom: "none", aspectRatio: "5 / 4", backgroundColor: "#0e0c08" }}
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
                  objectPosition: t.objectPosition,
                  opacity: 0.88,
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

/* ===================== FEATURED: MY GURU ===================== */
function FeatureCTA({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="no-underline inline-block uppercase text-center sm:whitespace-nowrap"
      style={{
        backgroundColor: "#faf2e8",
        color: "#c2542a",
        border: "1px solid #e8623c",
        padding: "16px 30px",
        fontFamily: "var(--font-meta)",
        fontSize: 12,
        letterSpacing: "0.22em",
        fontWeight: 600,
        transition: "background-color 200ms ease, color 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#e8623c";
        e.currentTarget.style.color = "#ffffff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#faf2e8";
        e.currentTarget.style.color = "#c2542a";
      }}
    >
      {label}
    </Link>
  );
}

function FeatureBlock({
  eyebrow,
  title,
  body,
  img,
  imgAlt,
  ctaLabel,
  ctaTo,
  reverse,
  background,
  objectPosition,
}: {
  eyebrow: string;
  title: string;
  body: string;
  img: string;
  imgAlt: string;
  ctaLabel: string;
  ctaTo: string;
  reverse?: boolean;
  background?: string;
  objectPosition?: string;
}) {
  return (
    <section
      style={{
        padding: "100px 24px",
        backgroundColor: background ?? "var(--background)",
      }}
    >
      <div
        className="mx-auto grid gap-10 md:gap-16 items-center"
        style={{
          maxWidth: 1100,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <div
          style={{
            order: reverse ? 2 : 1,
            aspectRatio: "4 / 5",
            overflow: "hidden",
            backgroundColor: "var(--muted)",
          }}
        >
          <img
            src={img}
            alt={imgAlt}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: objectPosition ?? "center center",
              display: "block",
            }}
          />
        </div>
        <div style={{ order: reverse ? 1 : 2 }}>
          <SectionEyebrow text={eyebrow} />
          <h2
            style={{
              fontFamily: "var(--font-serif-display)",
              fontStyle: "italic",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              lineHeight: 1.05,
              color: "var(--foreground)",
              marginTop: 18,
              marginBottom: 24,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif-body)",
              fontSize: 18,
              lineHeight: 1.8,
              color: "var(--muted-foreground)",
              marginBottom: 36,
              maxWidth: 520,
            }}
          >
            {body}
          </p>
          <FeatureCTA to={ctaTo} label={ctaLabel} />
        </div>
      </div>
    </section>
  );
}

function MyGuruFeature() {
  return (
    <FeatureBlock
      eyebrow="My Journey"
      title="My Guru"
      body="His Divine Grace A.C. Bhaktivedanta Swami Prabhupada (1896–1977), guru of Vaisesika Dasa, is widely regarded as the world's pre-eminent exponent of the teachings and practices of Bhakti-yoga to the Western world. He is the Founder-Acarya of the International Society for Krishna Consciousness (ISKCON)."
      img={guruImg}
      imgAlt="Srila Prabhupada surrounded by his disciples"
      ctaLabel="Read About Srila Prabhupada Swami"
      ctaTo="/my-journey/my-guru"
      objectPosition="center 30%"
    />
  );
}


function MyStoryFeature() {
  return (
    <FeatureBlock
      eyebrow="My Journey"
      title="My Story"
      body="When I was a child, I was deeply curious about the mystery of life. Trying to wrap my mind around it, I would sometimes ask my parents about the reasons for death. They thought that because I was so young, I shouldn't worry about it. But, I did."
      img={storyImg}
      imgAlt="Vaisesika Dasa"
      ctaLabel="Read My Story"
      ctaTo="/my-journey/my-story"
      reverse
      background="color-mix(in oklab, var(--brand-olive, var(--muted)) 6%, var(--background))"
      objectPosition="center 30%"
    />
  );
}

/* ===================== LATEST VIDEOS ===================== */
function LatestVideos({ videoIds }: { videoIds: string[] }) {
  return (
    <section style={{ padding: "100px 24px", backgroundColor: "var(--background)" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex items-end justify-between flex-wrap gap-4" style={{ marginBottom: 40 }}>
          <div>
            <SectionEyebrow text="Watch" />
            <h2
              style={{
                fontFamily: "var(--font-serif-display)",
                fontStyle: "italic",
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 1.1,
                color: "var(--foreground)",
                marginTop: 14,
              }}
            >
              Latest Videos
            </h2>
          </div>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
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
            Watch More →
          </a>
        </div>
        <div
          className="grid gap-6 md:gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
        >
          {videoIds.map((id) => (
            <YouTubeEmbed key={id} id={id} title="Fan The Spark video" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== LATEST AUDIO ===================== */
function LatestAudio() {
  const scUrl =
    `https://w.soundcloud.com/player/?` +
    new URLSearchParams({
      url: "https://api.soundcloud.com/users/192337999",
      color: "#ff5500",
      auto_play: "false",
      hide_related: "false",
      show_comments: "true",
      show_user: "true",
      show_reposts: "false",
      show_teaser: "true",
      visual: "false",
    }).toString();
  return (
    <section
      style={{
        padding: "100px 24px",
        backgroundColor: "color-mix(in oklab, var(--brand-olive, var(--muted)) 6%, var(--background))",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex items-end justify-between flex-wrap gap-4" style={{ marginBottom: 40 }}>
          <div>
            <SectionEyebrow text="Listen" />
            <h2
              style={{
                fontFamily: "var(--font-serif-display)",
                fontStyle: "italic",
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 1.1,
                color: "var(--foreground)",
                marginTop: 14,
              }}
            >
              Latest Audio
            </h2>
          </div>
          <Link
            to="/wisdom/audio-playlists"
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
            Listen More →
          </Link>
        </div>
        <div style={{ width: "100%", overflow: "hidden", borderRadius: 4 }}>
          <iframe
            title="Latest tracks from Fan The Spark on SoundCloud"
            width="100%"
            height={450}
            scrolling="no"
            frameBorder={0}
            allow="autoplay"
            src={scUrl}
            style={{ display: "block", border: 0, maxWidth: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}

/* ===================== BOOKS FEATURE ===================== */
function BooksFeature() {
  const family = getPostBySlug("our-family-business");
  const four = getPostBySlug("the-four-questions");
  const books = [
    {
      slug: "our-family-business",
      title: family?.title ?? "Our Family Business",
      desc: family?.excerpt ?? "",
      img: family?.featuredImage?.src ?? "",
    },
    {
      slug: "the-four-questions",
      title: four?.title ?? "The Four Questions",
      desc: four?.excerpt ?? "",
      img: four?.featuredImage?.src ?? "",
    },
  ];

  return (
    <section style={{ padding: "100px 24px", backgroundColor: "var(--background)" }}>
      <div className="mx-auto" style={{ maxWidth: 920 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionEyebrow text="Read" />
          <h2
            style={{
              fontFamily: "var(--font-serif-display)",
              fontStyle: "italic",
              fontSize: "clamp(32px, 4vw, 48px)",
              lineHeight: 1.1,
              color: "var(--foreground)",
              marginTop: 14,
              display: "inline-block",
            }}
          >
            Books &amp; Teachings
          </h2>
        </div>
        <div
          className="grid gap-8 md:gap-12 justify-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 280px))" }}
        >
          {books.map((b) => {
            const shortDesc =
              b.desc && b.desc.length > 140 ? b.desc.slice(0, 137).trimEnd() + "…" : b.desc;
            return (
              <Link
                key={b.slug}
                to="/wisdom/blog/$slug"
                params={{ slug: b.slug }}
                className="no-underline block group"
                style={{ borderBottom: "none" }}
              >
                <div
                  style={{
                    aspectRatio: "3 / 4",
                    overflow: "hidden",
                    backgroundColor: "var(--muted)",
                    marginBottom: 20,
                    boxShadow: "0 14px 40px -18px rgba(20,16,8,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={b.img}
                    alt={b.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                      transition: "transform 600ms ease",
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-serif-display)",
                    fontStyle: "italic",
                    fontSize: 24,
                    lineHeight: 1.15,
                    color: "var(--foreground)",
                    marginBottom: 10,
                  }}
                >
                  {b.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-serif-body)",
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "var(--muted-foreground)",
                    marginBottom: 14,
                  }}
                >
                  {shortDesc}
                </p>
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "var(--font-meta)",
                    fontSize: 12,
                    letterSpacing: "0.22em",
                    color: "var(--primary)",
                    borderBottom: "1px solid var(--primary)",
                    paddingBottom: 2,
                  }}
                >
                  Read More →
                </span>
              </Link>
            );
          })}
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

/* ===================== LATEST WRITINGS ===================== */
function LatestWritings({ posts }: { posts: Post[] }) {
  return (
    <section style={{ padding: "100px 24px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div className="flex items-end justify-between flex-wrap gap-4" style={{ marginBottom: 48 }}>
          <div>
            <SectionEyebrow text="Read" />
            <h2
              style={{
                fontFamily: "var(--font-serif-display)",
                fontStyle: "italic",
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 1.1,
                color: "var(--foreground)",
                marginTop: 14,
              }}
            >
              Latest Writings
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
            Read Articles →
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

/* ===================== TRANSFORMATIONAL STORIES + KIND WORDS ===================== */
function StoriesAndTestimonials() {
  return (
    <section
      style={{
        backgroundColor: "var(--brand-header-bg, var(--muted))",
        borderTop: "1px solid var(--brand-header-border, var(--border))",
        borderBottom: "1px solid var(--brand-header-border, var(--border))",
      }}
    >
      {/* Top: Transformational Stories teaser */}
      <div className="mx-auto" style={{ maxWidth: 1100, padding: "100px 24px 60px" }}>
        <div
          className="grid gap-10 md:gap-14 items-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          <div
            style={{
              aspectRatio: "4 / 3",
              overflow: "hidden",
              backgroundColor: "var(--muted)",
            }}
          >
            <img
              src={transformationStoriesImg}
              alt="A warm gathering of diverse people sharing joy and connection — a symbol of transformation through community"
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-meta)",
                fontSize: 11,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--brand-olive, var(--muted-foreground))",
                marginBottom: 12,
              }}
            >
              Stories
            </p>
            <h3
              style={{
                fontFamily: "var(--font-serif-display)",
                fontStyle: "italic",
                fontSize: "clamp(34px, 4vw, 48px)",
                lineHeight: 1.1,
                color: "var(--foreground)",
                marginBottom: 20,
              }}
            >
              Transformational Stories
            </h3>
            <p
              style={{
                fontFamily: "var(--font-serif-body)",
                fontSize: 17,
                lineHeight: 1.7,
                color: "var(--muted-foreground)",
                marginBottom: 28,
                maxWidth: 480,
              }}
            >
              Every life touched by bhakti tells its own quiet story. Here we gather those stories — from kindred spirits who walked into a small group, asked a question, attended a retreat, or simply began to chant — and found something steady underneath the noise of daily life.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Link
                to="/serve/transformational-stories"
                className="no-underline uppercase"
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
                Read Stories →
              </Link>
              <Link
                to="/contact"
                className="no-underline uppercase"
                style={{
                  fontFamily: "var(--font-meta)",
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--brand-orange, #d96a4a)",
                  borderBottom: "1px solid var(--brand-orange, #d96a4a)",
                  paddingBottom: 2,
                }}
              >
                Share Your Story →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto" style={{ maxWidth: 1100, padding: "0 24px" }}>
        <div
          style={{
            height: 1,
            backgroundColor: "var(--brand-header-border, var(--border))",
            opacity: 0.6,
          }}
        />
      </div>

      {/* Bottom: Kind Words (testimonials) */}
      <div className="mx-auto" style={{ maxWidth: 1100, padding: "60px 24px 100px" }}>
        <p
          className="text-center"
          style={{
            fontFamily: "var(--font-meta)",
            fontSize: 12,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "var(--brand-olive, var(--muted-foreground))",
            marginBottom: 48,
          }}
        >
          Voices from the Journey
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="flex flex-col">
              <blockquote
                style={{
                  fontFamily: "var(--font-serif-body)",
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: "var(--brand-title-color, var(--foreground))",
                }}
              >
                {t.quote}
              </blockquote>
              <figcaption
                className="mt-5"
                style={{
                  fontFamily: "var(--font-serif-body)",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--brand-orange, #d96a4a)",
                }}
              >
                {t.author}
              </figcaption>
            </figure>
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
