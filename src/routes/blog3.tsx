import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blog3")({
  component: BlogLayout,
});

function BlogLayout() {
  return (
    <Outlet />
  );
}
