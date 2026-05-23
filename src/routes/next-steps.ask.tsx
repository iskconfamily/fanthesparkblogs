import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/next-steps/ask")({
  head: () => ({
    meta: [
      { title: "Ask — Next Steps · Fan The Spark" },
      { name: "description", content: "Write in with a question on practice, philosophy or daily life — Vaisesika Dasa will respond." },
      { property: "og:title", content: "Ask — Next Steps · Fan The Spark" },
      { property: "og:description", content: "Write in with a question on practice, philosophy or daily life — Vaisesika Dasa will respond." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/next-steps/ask" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Next Steps"
      title="Ask"
      intro="Use the form below to write in with a question on practice, philosophy or daily life. Vaisesika Dasa reads every note."
      contactCategory="Next Steps"
    />
  ),
});
