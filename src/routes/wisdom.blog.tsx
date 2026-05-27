import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site-layout";
import { PostPreview } from "@/components/post-preview";
import { getPublishedDbPosts } from "@/lib/blog.functions";
import { mergePosts } from "@/lib/merge-posts";

export const Route = createFileRoute("/wisdom/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Wisdom · Fan The Spark" },
      { name: "description", content: "Long-form bhakti essays on hearing, chanting, and remembering Krishna." },
      { property: "og:title", content: "Blog — Wisdom · Fan The Spark" },
      { property: "og:description", content: "Long-form bhakti essays on hearing, chanting, and remembering Krishna." },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/wisdom/blog" }],
  }),
  loader: () => getPublishedDbPosts(),
  component: BlogIndex,
});

function BlogIndex() {
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
