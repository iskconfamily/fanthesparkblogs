import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/wisdom/videos")({
  head: () => ({
    meta: [
      { title: "Videos — Wisdom · Fan The Spark" },
      { name: "description", content: "Talks, classes and conversations on bhakti-yoga with Vaisesika Dasa." },
      { property: "og:title", content: "Videos — Wisdom · Fan The Spark" },
      { property: "og:description", content: "Talks, classes and conversations on bhakti-yoga with Vaisesika Dasa." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/wisdom/videos" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Wisdom"
      title="Videos"
      intro="A growing library of talks, classes and conversations. Content for this page is coming soon."
      contactCategory="Wisdom / Dhamesvara"
    />
  ),
});
