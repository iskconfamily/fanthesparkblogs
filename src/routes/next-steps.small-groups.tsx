import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/next-steps/small-groups")({
  head: () => ({
    meta: [
      { title: "Small Groups — Next Steps · Fan The Spark" },
      { name: "description", content: "Find or start a small group near you for regular hearing, chanting and association." },
      { property: "og:title", content: "Small Groups — Next Steps · Fan The Spark" },
      { property: "og:description", content: "Find or start a small group near you for regular hearing, chanting and association." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/next-steps/small-groups" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Next Steps"
      title="Small Groups"
      intro="A growing network of small groups meet regularly to hear, chant and support one another. Content for this page is coming soon."
      contactCategory="Small Groups"
    />
  ),
});
