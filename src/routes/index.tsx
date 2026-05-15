import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { PostPreview } from "@/components/post-preview";
import { getAllPosts } from "@/content/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "sravaṇādi jala — sprinkling the water of hearing & chanting" },
      { name: "description", content: "Quiet, long-form bhakti essays on hearing, chanting, and the practice of remembering Krishna." },
      { property: "og:title", content: "sravaṇādi jala" },
      { property: "og:description", content: "Sprinkling the water of hearing and chanting — long-form bhakti essays." },
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
