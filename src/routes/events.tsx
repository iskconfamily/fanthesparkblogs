import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Fan The Spark" },
      { name: "description", content: "Upcoming talks, retreats, kirtans and travels with Vaisesika Dasa." },
      { property: "og:title", content: "Events — Fan The Spark" },
      { property: "og:description", content: "Upcoming talks, retreats, kirtans and travels with Vaisesika Dasa." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/events" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Events"
      title="Events"
      intro="Upcoming talks, retreats, kirtans and travels. The full calendar is coming soon."
      contactCategory="Events"
    />
  ),
});
