import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Para } from "@/components/editorial";

export const Route = createFileRoute("/next-steps/spiritual-retreat")({
  head: () => ({
    meta: [
      { title: "Spiritual Retreat — Next Steps · Fan The Spark" },
      { name: "description", content: "Draw back from the daily grind and reconnect with spirit at one of Vaisesika Dasa's dynamic spiritual retreats." },
      { property: "og:title", content: "Spiritual Retreat — Next Steps · Fan The Spark" },
      { property: "og:description", content: "Draw back from the daily grind and reconnect with spirit at one of Vaisesika Dasa's dynamic spiritual retreats." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/next-steps/spiritual-retreat" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Next Steps"
      title="Spiritual Retreat"
      intro="Retreat is a natural part of life. Each day the darkness retreats as the light rises, and each night the light retreats as the darkness rises. Each month and each day, year-round, the tide also comes in and then retreats, and falls back again."
      body={
        <>
          <Para>
            In fact, the etymological origins of the word <em>"retreat"</em> come from the Old French word <em>"retret,"</em> which means to <em>"draw back,"</em> or to <em>"call back."</em> And yet, how often do you meaningfully, and regularly, retreat from your everyday life in order to go inward and address the needs of your soul?
          </Para>
          <Para>
            The need for retreat is one of the most basic ingredients of spiritual life, and yet frequently it is lacking due to overextending ourselves in too many directions at once. This is exactly why Vaisesika Dasa is passionate about providing opportunities for people to <em>"draw back"</em> from the daily grind and reconnect with spirit.
          </Para>
          <Para>
            <em>
              "Most importantly, you will come away remembering the importance of 'retreat,' as well as all the easy and everyday ways you can bring this 'step back' rhythm into your life."
            </em>
          </Para>
        </>
      }
      contactCategory="Spiritual Retreat"
      contactTitle="Interested in Learning More About the Retreat?"
    />
  ),
});
