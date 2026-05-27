import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Para } from "@/components/editorial";
import smallGroupsImg from "@/assets/transformational-stories.jpg?format=webp&w=900&quality=78";

export const Route = createFileRoute("/next-steps/small-groups")({
  head: () => ({
    meta: [
      { title: "Small Groups Near You — Next Steps · Fan The Spark" },
      { name: "description", content: "Join one of Vaisesika Dasa's monthly spiritual transformation circles — meet kindred spirits and begin a transformational journey, on-site or online." },
      { property: "og:title", content: "Small Groups Near You — Next Steps · Fan The Spark" },
      { property: "og:description", content: "Join one of Vaisesika Dasa's monthly spiritual transformation circles — meet kindred spirits and begin a transformational journey, on-site or online." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/next-steps/small-groups" }],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Next Steps"
      title="Small Groups Near You"
      headerAccent={
        <figure
          className="mx-auto lg:mx-0 max-w-[420px]"
          style={{
            border: "1px solid var(--brand-header-border, var(--border))",
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "var(--brand-header-bg, var(--card))",
            boxShadow: "0 1px 2px rgba(60, 50, 20, 0.04)",
          }}
        >
          <img
            src={smallGroupsImg}
            alt="A circle of seekers gathered in warm spiritual community"
            loading="eager"
            decoding="async"
            style={{
              width: "100%",
              aspectRatio: "4 / 5",
              objectFit: "cover",
              display: "block",
            }}
          />
          <figcaption
            className="px-5 py-4 text-center"
            style={{
              fontFamily: "var(--font-serif-display)",
              fontStyle: "italic",
              fontSize: 16,
              color: "var(--brand-olive, var(--muted-foreground))",
              borderTop: "1px solid var(--brand-header-border, var(--border))",
            }}
          >
            Kindred spirits, monthly circles
          </figcaption>
        </figure>
      }
      intro="If we want to personally evolve and find lasting happiness, then the truth is that we need more than just knowledge and techniques. We also need real friends and real spiritual community."
      body={
        <>
          <Para>
            As Eleanor Roosevelt once wrote, <em>"Many people will walk in and out of your life, but only true friends will leave footprints in your heart."</em> When you join one of Vaisesika Dasa's monthly spiritual transformation circles, you will meet kindred spirits as you begin a transformational journey that will change your life from the inside out.
          </Para>
          <Para>
            Once a month, Vaisesika Dasa offers talks on a wide range of spiritual topics, from how to take conscious control of your daily lifestyle habits, to achieving inner peace during turbulent times, or learning amazing lessons from nature. Each talk is a participatory experience where honest questions and reflections are encouraged while timeless wisdom is also being shared from a monk with over four and a half decades worth of experience in the Bhakti Yoga tradition.
          </Para>
          <Para>
            Come and meet new people while learning from a veteran monk, author, and spiritual guide. Vaisesika Dasa regularly speaks at corporations, universities, and nonprofits, teaching universal principles of spiritual development. Renowned for his heart-centered wisdom, good humor, and his expansive philosophical knowledge, Vaisesika makes ancient yogic wisdom and practices relevant, fun, and easily accessible.
          </Para>
          <Para>
            Join one of his local spiritual transformation circles, and get started evolving and meeting new friends, today. Register to see all groups and options to join the program on-site or online.
          </Para>
        </>
      }
      contactCategory="Small Groups"
      contactTitle="Small Groups Near You"
    />
  ),
});
