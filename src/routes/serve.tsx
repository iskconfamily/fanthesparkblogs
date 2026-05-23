import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/serve")({
  head: () => ({
    meta: [
      { title: "Serve — Fan The Spark" },
      { name: "description", content: "Ways to take part — volunteer your time, give, or share a transformational story." },
      { property: "og:title", content: "Serve — Fan The Spark" },
      { property: "og:description", content: "Ways to take part — volunteer your time, give, or share a transformational story." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/serve" }],
  }),
  component: () => (
    <HubPage
      eyebrow="Serve"
      title="Serve"
      intro="Service is the heart of bhakti. Here are a few ways to take part."
      links={[
        { to: "/serve/volunteer", label: "Volunteer", blurb: "Lend your time and skills — design, tech, writing, events, more." },
        { to: "/serve/give", label: "Give", blurb: "Support the work of sharing bhakti with seekers around the world." },
        { to: "/serve/transformational-stories", label: "Transformational Stories", blurb: "How bhakti has changed lives — read, and share your own." },
      ]}
      contactCategory="Volunteer"
    />
  ),
});
