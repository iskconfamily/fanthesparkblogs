import { createFileRoute } from "@tanstack/react-router";
import { SiteLayoutMarketing } from "@/components/site-layout-marketing";

export const Route = createFileRoute("/my-story")({
  head: () => ({
    meta: [
      { title: "My Story — Fan The Spark" },
      { name: "description", content: "The personal journey behind Fan The Spark." },
      { property: "og:title", content: "My Story — Fan The Spark" },
      { property: "og:description", content: "The personal journey behind Fan The Spark." },
    ],
  }),
  component: MyStoryPage,
});

function MyStoryPage() {
  return (
    <SiteLayoutMarketing>
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <p
          className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          My Journey
        </p>
        <h1
          className="text-5xl italic mb-8"
          style={{ fontFamily: "var(--font-serif-display)" }}
        >
          My Story
        </h1>
        <p
          className="text-[19px] leading-[1.8] text-muted-foreground"
          style={{ fontFamily: "var(--font-serif-body)" }}
        >
          This page is a placeholder for the story to come.
        </p>
      </div>
    </SiteLayoutMarketing>
  );
}
