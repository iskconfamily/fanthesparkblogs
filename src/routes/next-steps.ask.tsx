import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Para } from "@/components/editorial";

export const Route = createFileRoute("/next-steps/ask")({
  head: () => ({
    meta: [
      { title: "Ask Vaisesika Dasa — Next Steps · Fan The Spark" },
      { name: "description", content: "Submit a question on practice, philosophy or daily life — Vaisesika Dasa, a modern-day monk with more than four decades of yogic practice, will respond." },
      { property: "og:title", content: "Ask Vaisesika Dasa — Next Steps · Fan The Spark" },
      { property: "og:description", content: "Submit a question on practice, philosophy or daily life — Vaisesika Dasa, a modern-day monk with more than four decades of yogic practice, will respond." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/next-steps/ask" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Next Steps"
      title="Ask Vaisesika Dasa"
      intro="Throughout the course of our life, we are sometimes made to believe that raising questions are an indication of something lacking within ourselves, something ignorant or untrained that should not be seen or shared with others. But the truth is that from the standpoint of the yogic tradition, an honest and deep question is like a seed; it is the evidence of new spiritual life stirring within us."
      body={
        <>
          <Para>
            For spiritual seekers; when we ask a deeper question, we are literally reaching out to higher sources of knowledge, which begins teaching us to trust that there are also higher answers and truth available.
          </Para>
          <Para>
            When you reach out and ask a question to Vaisesika Dasa, the answer you will receive comes from a modern-day monk with over four and a half decades worth of committed, daily immersion into the philosophy, rituals, and practices of traditional bhakti yoga. Vaisesika Dasa began living in his first monastic setting at the age of sixteen, with the blessing of his parents, and soon after took initiation as a monk. Since that time, Vaisesika Dasa has been traveling the globe and teaching others about the values of spiritual life in all different settings, from corporate environments, to yoga studios and universities.
          </Para>
          <Para>
            Whether you have a question about something like your job or your relationships, or deeper questions like, <em>"Why am I here?"</em> or <em>"What happens when I die?"</em> the question you ask will be answered in one of Vaisesika Dasa's upcoming podcast or via email. Vaisesika will lovingly address your question from the standpoint of the timeless wisdom of bhakti yoga, as well as from the space of his own personal experiences and insights as a monk.
          </Para>
          <Para>
            Remember, there is no such thing as a bad question when it's coming from your heart. So please, submit your question using the form below — and then tune in regularly to hear his response.
          </Para>
        </>
      }
      contactCategory="Ask Vaisesika Dasa"
      contactTitle="Ask Vaisesika Dasa"
    />
  ),
});
