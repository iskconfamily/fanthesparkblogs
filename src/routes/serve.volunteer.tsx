import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/serve/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer — Serve · Fan The Spark" },
      { name: "description", content: "Lend your time and skills — design, tech, writing, events and more." },
      { property: "og:title", content: "Volunteer — Serve · Fan The Spark" },
      { property: "og:description", content: "Lend your time and skills — design, tech, writing, events and more." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/serve/volunteer" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Serve"
      title="Volunteer"
      intro="There are many ways to lend a hand. Tell us a bit about yourself and where you'd like to help."
      contactCategory="Volunteer"
    />
  ),
});
