import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPostById } from "@/lib/admin.functions";
import { PostEditor } from "@/components/admin/post-editor";

export const Route = createFileRoute("/admin/edit/$id")({
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  const fetchPost = useServerFn(getPostById);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-post", id],
    queryFn: () => fetchPost({ data: { id } }),
  });
  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!data) return <p className="text-muted-foreground">Not found.</p>;
  return <PostEditor existing={data} />;
}
