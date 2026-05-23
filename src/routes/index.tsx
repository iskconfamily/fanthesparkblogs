import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site-layout";
import { PostPreview } from "@/components/post-preview";
import { EventCard } from "@/components/event-card";
import { getAllPosts } from "@/content/queries";
import { getPublishedDbPosts } from "@/lib/blog.functions";
import { getUpcomingEvents, type EventRow } from "@/lib/events.functions";
import type { Post } from "@/content/posts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fan The Spark — sprinkling the water of hearing & chanting" },
      { name: "description", content: "Quiet, long-form bhakti essays on hearing, chanting, and the practice of remembering Krishna." },
      { property: "og:title", content: "Fan The Spark" },
      { property: "og:description", content: "Sprinkling the water of hearing and chanting — long-form bhakti essays." },
    ],
  }),
  loader: async () => {
    const [posts, events] = await Promise.all([
      getPublishedDbPosts(),
      getUpcomingEvents({ data: { limit: 3 } }),
    ]);
    return { posts, events };
  },
  component: Home,
});

function mergePosts(dbPosts: Post[]): Post[] {
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const staticPosts = getAllPosts().filter((p) => !dbSlugs.has(p.slug));
  return [...dbPosts, ...staticPosts].sort((a, b) => b.date.localeCompare(a.date));
}

function Home() {
  const initial = Route.useLoaderData();
  const fetchPosts = useServerFn(getPublishedDbPosts);
  const fetchEvents = useServerFn(getUpcomingEvents);
  const { data: dbPosts = initial.posts } = useQuery({
    queryKey: ["published-posts"],
    queryFn: () => fetchPosts(),
    initialData: initial.posts,
  });
  const { data: events = initial.events } = useQuery({
    queryKey: ["upcoming-events", 3],
    queryFn: () => fetchEvents({ data: { limit: 3 } }),
    initialData: initial.events,
  });
  const posts = mergePosts(dbPosts);
  return (
    <SiteLayout>
      {events.length > 0 ? <UpcomingEventsBlock events={events} /> : null}
      {posts.map((p) => (
        <PostPreview key={p.slug} post={p} />
      ))}
    </SiteLayout>
  );
}

function UpcomingEventsBlock({ events }: { events: EventRow[] }) {
  return (
    <section className="mb-12">
      <div className="flex items-baseline justify-between mb-5">
        <h2
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: 28,
            color: "var(--brand-title-color, var(--foreground))",
          }}
        >
          Upcoming Events
        </h2>
        <Link
          to="/events"
          className="uppercase no-underline"
          style={{
            fontFamily: "var(--font-meta)",
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "var(--brand-olive, var(--muted-foreground))",
            borderBottom: "1px solid var(--brand-gold, currentColor)",
            paddingBottom: 2,
          }}
        >
          See all
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <EventCard key={e.id} event={e} compact />
        ))}
      </div>
      <hr className="mt-12" style={{ borderColor: "var(--brand-header-border, var(--border))" }} />
    </section>
  );
}
