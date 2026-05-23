import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Para } from "@/components/editorial";

export const Route = createFileRoute("/serve/transformational-stories")({
  head: () => ({
    meta: [
      { title: "Transformational Stories — Serve · Fan The Spark" },
      { name: "description", content: "How bhakti has changed lives. Read stories from kindred spirits — and share your own." },
      { property: "og:title", content: "Transformational Stories — Serve · Fan The Spark" },
      { property: "og:description", content: "How bhakti has changed lives. Read stories from kindred spirits — and share your own." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/serve/transformational-stories" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Serve"
      title="Transformational Stories"
      intro="Every life touched by bhakti tells its own quiet story. Here we gather those stories — from kindred spirits who walked into a small group, asked a question, attended a retreat, or simply began to chant — and found something steady underneath the noise of daily life."
      body={
        <>
          <Para>
            If a teaching, a conversation, a retreat, or a moment of seva has shifted something in you, we would love to hear about it. Use the form below to share your transformational story. With your permission, we may share it here so that others can take heart from your experience.
          </Para>
        </>
      }
      contactCategory="Transformational Stories"
      contactTitle="Share Your Story"
    />
  ),
});
