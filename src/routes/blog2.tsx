import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blog2")({
  component: BlogLayout,
});

function BlogLayout() {
  return (
    <Outlet />
  );
}
