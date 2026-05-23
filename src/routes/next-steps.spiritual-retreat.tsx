import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/next-steps/spiritual-retreat")({
  head: () => ({
    meta: [
      { title: "Spiritual Retreat — Next Steps · Fan The Spark" },
      { name: "description", content: "Step away for a few days of focused practice, study and community." },
      { property: "og:title", content: "Spiritual Retreat — Next Steps · Fan The Spark" },
      { property: "og:description", content: "Step away for a few days of focused practice, study and community." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/next-steps/spiritual-retreat" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Next Steps"
      title="Spiritual Retreat"
      intro="A few days away to deepen your practice. Upcoming retreat dates and details are coming soon."
      contactCategory="Spiritual Retreat"
    />
  ),
});
