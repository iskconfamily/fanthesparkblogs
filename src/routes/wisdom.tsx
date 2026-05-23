import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/wisdom")({
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
        { to: "/wisdom/blog", label: "Blog", blurb: "Essays on hearing, chanting and the practice of remembering Krishna." },
        { to: "/wisdom/videos", label: "Videos", blurb: "Talks and conversations from retreats, classes and travels." },
        { to: "/wisdom/audio-playlists", label: "Audio Playlists", blurb: "Curated kirtan and chanting playlists for daily practice." },
      ]}
      contactCategory="Wisdom / Dhamesvara"
    />
  ),
});
