import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/serve/transformational-stories")({
  head: () => ({
    meta: [
      { title: "Transformational Stories — Serve · Fan The Spark" },
      { name: "description", content: "How bhakti has changed lives — read, and share your own story." },
      { property: "og:title", content: "Transformational Stories — Serve · Fan The Spark" },
      { property: "og:description", content: "How bhakti has changed lives — read, and share your own story." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/serve/transformational-stories" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Serve"
      title="Transformational Stories"
      intro="Real stories from people whose lives have been changed by bhakti. Stories and submissions are coming soon."
      contactCategory="Others"
    />
  ),
});
