import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/next-steps/")({
  head: () => ({
    meta: [
      { title: "Next Steps — Fan The Spark" },
      { name: "description", content: "Ask a question, join a small group near you, come on retreat, or explore other projects inspired by Vaisesika Dasa." },
      { property: "og:title", content: "Next Steps — Fan The Spark" },
      { property: "og:description", content: "Ask a question, join a small group near you, come on retreat, or explore other projects inspired by Vaisesika Dasa." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/next-steps" }],
  }),
  component: () => (
    <HubPage
      eyebrow="Next Steps"
      title="Next Steps"
      intro="If something here has stirred you, here are a few ways to take the next step."
      links={[
        { to: "/next-steps/ask", label: "Ask Vaisesika Dasa", blurb: "Submit an honest question on practice, philosophy, or daily life — to be answered in an upcoming podcast or by email." },
        { to: "/next-steps/small-groups", label: "Small Groups Near You", blurb: "Join one of Vaisesika Dasa's monthly spiritual transformation circles — on-site or online." },
        { to: "/next-steps/spiritual-retreat", label: "Spiritual Retreat", blurb: "Step away from the daily grind for a few days of focused practice, study, and community." },
        { to: "/next-steps/other-projects", label: "Other Projects", blurb: "A wider family of sankirtana projects Vaisesika Dasa has founded or inspired around the world." },
      ]}
      contactCategory="Next Steps"
    />
  ),
});
