import { createFileRoute, redirect } from "@tanstack/react-router";
import { getRandomPost } from "@/content/queries";

export const Route = createFileRoute("/surprise")({
  beforeLoad: () => {
    const p = getRandomPost();
    throw redirect({ to: "/post/$slug", params: { slug: p.slug } });
  },
});
