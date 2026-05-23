import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/serve/")({
  head: () => ({
    meta: [
      { title: "Serve — Fan The Spark" },
      { name: "description", content: "Meet the servant leaders, give back, volunteer your time and skills, or read transformational stories of bhakti in action." },
      { property: "og:title", content: "Serve — Fan The Spark" },
      { property: "og:description", content: "Meet the servant leaders, give back, volunteer your time and skills, or read transformational stories of bhakti in action." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/serve" }],
  }),
  component: () => (
    <HubPage
      eyebrow="Serve"
      title="Serve"
      intro="In the yogic tradition, selfless service — seva — is the most beneficial method for deepening what we've received as a gift from spirit. Here are a few ways to take part."
      links={[
        { to: "/serve/servant-leaders", label: "Servant Leaders", blurb: "Meet the team of platinum, gold, silver, bronze and copper-level selfless servants who keep this work alive." },
        { to: "/serve/give", label: "Give", blurb: "Become a digital donor and help sustain the daily production of classes, podcasts, and bhakti teachings." },
        { to: "/serve/volunteer", label: "Volunteer", blurb: "Lend your time and skills — digital, retreats, books, conscious cooking, and the monthly programs." },
        { to: "/serve/transformational-stories", label: "Transformational Stories", blurb: "Read how bhakti has changed lives — and share your own." },
      ]}
      contactCategory="Serve"
    />
  ),
});
