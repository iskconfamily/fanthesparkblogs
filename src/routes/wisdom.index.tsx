import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/placeholder-page";

const YOUTUBE_URL = "https://www.youtube.com/c/FanTheSpark";
const ITUNES_URL = "https://podcasts.apple.com/us/podcast/fan-the-spark/id1153081672";

export const Route = createFileRoute("/wisdom/")({
  head: () => ({
    meta: [
      { title: "Wisdom — Fan The Spark" },
      { name: "description", content: "Long-form essays, talks and chant playlists on bhakti-yoga." },
      { property: "og:title", content: "Wisdom — Fan The Spark" },
      { property: "og:description", content: "Long-form essays, talks and chant playlists on bhakti-yoga." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/wisdom" }],
  }),
  component: () => (
    <HubPage
      eyebrow="Wisdom"
      title="Wisdom"
      intro="Quiet, long-form bhakti — to read, to watch, and to hear."
      links={[
        { to: "/wisdom/lord", label: "Lord Chaitanya", blurb: "The history and philosophy of Sri Caitanya Mahaprabhu — the Golden Avatara who inaugurated the sankirtana movement." },
        { to: "/wisdom/blog", label: "Blog", blurb: "Essays on hearing, chanting and the practice of remembering Krishna." },
        { to: YOUTUBE_URL, label: "Videos", blurb: "Talks, classes and conversations on the Fan The Spark YouTube channel.", external: true },
        { to: "/wisdom/audio-playlists", label: "Audio Playlists", blurb: "Curated SoundCloud playlists — kirtan, japa and weekly podcasts." },
        { to: ITUNES_URL, label: "iTunes Podcast", blurb: "Subscribe to Fan The Spark on Apple Podcasts.", external: true },
      ]}
      contactCategory="Wisdom / Dhamesvara"
    />
  ),
});
