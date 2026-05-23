import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/next-steps")({
  head: () => ({
    meta: [
      { title: "Next Steps — Fan The Spark" },
      { name: "description", content: "Practical next steps on the path of bhakti — ask a question, join a small group, or come on retreat." },
      { property: "og:title", content: "Next Steps — Fan The Spark" },
      { property: "og:description", content: "Practical next steps on the path of bhakti — ask a question, join a small group, or come on retreat." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/next-steps" }],
  }),
  component: () => (
    <HubPage
      eyebrow="Next Steps"
      title="Next Steps"
      intro="If something here has stirred you, here are a few ways to take the next step."
      links={[
        { to: "/next-steps/ask", label: "Ask", blurb: "A question on practice, on philosophy, on daily life — write in and Vaisesika Dasa will respond." },
        { to: "/next-steps/small-groups", label: "Small Groups", blurb: "Find or start a small group near you for regular hearing, chanting and association." },
        { to: "/next-steps/spiritual-retreat", label: "Spiritual Retreat", blurb: "Step away for a few days of focused practice, study and community." },
      ]}
      contactCategory="Next Steps"
    />
  ),
});
