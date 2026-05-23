import { createFileRoute } from "@tanstack/react-router";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import { ContactSection } from "@/components/contact-section";
import { Dots, Para, Prose } from "@/components/editorial";

type Playlist = {
  title: string;
  kind: "playlist" | "user";
  id: string;
};

const PLAYLISTS: Playlist[] = [
  { title: "Latest Tracks", kind: "user", id: "192337999" },
  { title: "Bhakti Pulse", kind: "playlist", id: "303452492" },
  { title: "Happy Japa", kind: "playlist", id: "303437955" },
  { title: "Teamwork", kind: "playlist", id: "678249312" },
  { title: "Podcasts from 2019", kind: "playlist", id: "678249039" },
  { title: "Podcasts from 2018", kind: "playlist", id: "414360620" },
  { title: "Podcasts from 2017", kind: "playlist", id: "304842150" },
  { title: "Podcasts from 2016", kind: "playlist", id: "214511317" },
];

function scUrl(p: Playlist) {
  const resource =
    p.kind === "playlist"
      ? `https://api.soundcloud.com/playlists/${p.id}`
      : `https://api.soundcloud.com/users/${p.id}`;
  const params = new URLSearchParams({
    url: resource,
    color: "#c4654a",
    auto_play: "false",
    hide_related: "false",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

export const Route = createFileRoute("/wisdom/audio-playlists")({
  head: () => ({
    meta: [
      { title: "Audio Playlists — Wisdom · Fan The Spark" },
      { name: "description", content: "Curated SoundCloud playlists — kirtan, japa and weekly podcasts for daily practice." },
      { property: "og:title", content: "Audio Playlists — Wisdom · Fan The Spark" },
      { property: "og:description", content: "Curated SoundCloud playlists — kirtan, japa and weekly podcasts for daily practice." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/wisdom/audio-playlists" }],
  }),
  component: AudioPlaylistsPage,
});

function AudioPlaylistsPage() {
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
            Wisdom
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
            Audio Playlists
          </h1>
        </div>
      </section>

      <Prose tight="bottom">
        <Dots />
        <Para>
          Curated SoundCloud playlists — kirtan, japa and weekly podcasts to listen to throughout the day.
        </Para>
      </Prose>

      <section style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-[860px] px-6 pb-16 sm:pb-24 space-y-12">
          {PLAYLISTS.map((p) => (
            <div key={p.id}>
              <h2
                className="mb-4"
                style={{
                  fontFamily: "var(--font-serif-display)",
                  fontStyle: "italic",
                  fontSize: 28,
                  lineHeight: 1.15,
                  color: "var(--brand-title-color, var(--foreground))",
                }}
              >
                {p.title}
              </h2>
              <iframe
                title={p.title}
                width="100%"
                height={p.kind === "user" ? 450 : 350}
                scrolling="no"
                frameBorder={0}
                allow="autoplay"
                src={scUrl(p)}
                style={{ border: 0, borderRadius: 4 }}
              />
            </div>
          ))}
        </div>
      </section>

      <ContactSection defaultCategory="Wisdom / Dhamesvara" />
    </SiteLayoutWeb>
  );
}
