import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site-layout";
import { PostPreview } from "@/components/post-preview";
import { getAllPosts } from "@/content/queries";
import { getPublishedDbPosts } from "@/lib/blog.functions";
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
  loader: () => getPublishedDbPosts(),
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
  const { data: dbPosts = initial } = useQuery({
    queryKey: ["published-posts"],
    queryFn: () => fetchPosts(),
    initialData: initial,
  });
  const posts = mergePosts(dbPosts);
  return (
    <SiteLayout>
      {posts.map((p) => (
        <PostPreview key={p.slug} post={p} />
      ))}
    </SiteLayout>
  );
}
