import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/my-journey/")({
  head: () => ({
    meta: [
      { title: "My Journey — Fan The Spark" },
      { name: "description", content: "The personal story of Vaisesika Dasa and his guru, Srila Prabhupada." },
      { property: "og:title", content: "My Journey — Fan The Spark" },
      { property: "og:description", content: "The personal story of Vaisesika Dasa and his guru, Srila Prabhupada." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/my-journey" }],
  }),
  component: () => (
    <HubPage
      eyebrow="My Journey"
      title="My Journey"
      intro="A personal path through bhakti — from childhood questions about the mystery of life, to a lifetime in the shelter of a great teacher."
      links={[
        { to: "/my-journey/my-story", label: "My Story", blurb: "How a teenager's burning questions led to a life in bhakti-yoga." },
        { to: "/my-journey/my-guru", label: "My Guru", blurb: "His Divine Grace A.C. Bhaktivedanta Swami Prabhupada — life, work and legacy." },
      ]}
    />
  ),
});
