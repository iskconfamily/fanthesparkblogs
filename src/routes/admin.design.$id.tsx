import { createFileRoute } from "@tanstack/react-router";
import { BlogStudio } from "@/components/admin/blog-studio";

export const Route = createFileRoute("/admin/design/$id")({
  component: DesignPage,
});

function DesignPage() {
  const { id } = Route.useParams();
  return <BlogStudio postId={id} />;
}
