import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/serve/give")({
  head: () => ({
    meta: [
      { title: "Give — Serve · Fan The Spark" },
      { name: "description", content: "Support the work of sharing bhakti with seekers around the world." },
      { property: "og:title", content: "Give — Serve · Fan The Spark" },
      { property: "og:description", content: "Support the work of sharing bhakti with seekers around the world." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/serve/give" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Serve"
      title="Give"
      intro="Your generosity helps us share bhakti with seekers around the world. Giving options are coming soon."
      contactCategory="Donation"
    />
  ),
});
