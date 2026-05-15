import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { PostPreview } from "@/components/post-preview";
import { getAllPosts } from "@/content/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Marginalia — A literary journal of attention" },
      { name: "description", content: "Long-form essays on poetry, books, and the slow practice of being alive." },
      { property: "og:title", content: "The Marginalia" },
      { property: "og:description", content: "A literary journal of attention, books, and quiet wonder." },
    ],
  }),
  component: Home,
});

function Home() {
  const posts = getAllPosts();
  return (
    <SiteLayout>
      {posts.map((p) => (
        <PostPreview key={p.slug} post={p} />
      ))}
    </SiteLayout>
  );
}
