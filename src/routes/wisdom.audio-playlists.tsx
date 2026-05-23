import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/wisdom/audio-playlists")({
  head: () => ({
    meta: [
      { title: "Audio Playlists — Wisdom · Fan The Spark" },
      { name: "description", content: "Curated kirtan and chanting playlists for daily practice." },
      { property: "og:title", content: "Audio Playlists — Wisdom · Fan The Spark" },
      { property: "og:description", content: "Curated kirtan and chanting playlists for daily practice." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/wisdom/audio-playlists" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Wisdom"
      title="Audio Playlists"
      intro="Curated kirtan and chant playlists for your daily practice. Content for this page is coming soon."
      contactCategory="Wisdom / Dhamesvara"
    />
  ),
});
