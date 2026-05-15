import { createFileRoute } from "@tanstack/react-router";
import { PostEditor } from "@/components/admin/post-editor";

export const Route = createFileRoute("/admin/new")({
  component: () => <PostEditor />,
});
