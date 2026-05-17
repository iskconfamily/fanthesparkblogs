import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { InlineNewsletter } from "@/components/inline-newsletter";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "The Sunday Letter — Fan The Spark" },
      { name: "description", content: "One quiet essay, every Sunday morning. Free, ad-free, unhurried." },
      { property: "og:title", content: "The Sunday Letter" },
      { property: "og:description", content: "Subscribe to the Sunday Letter." },
    ],
  }),
  component: NewsletterPage,
});

function NewsletterPage() {
  return (
    <SiteLayout>
      <p
        className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        Free weekly letter
      </p>
      <h1 className="text-5xl italic mb-6" style={{ fontFamily: "var(--font-serif-display)" }}>
        The Sunday Letter
      </h1>
      <div
        className="prose-literary text-[19px] leading-[1.8] space-y-5"
        style={{ fontFamily: "var(--font-serif-body)" }}
      >
        <p>
          Each Sunday morning, a single quiet essay arrives in your inbox. Sometimes a poem, sometimes a passage from a book worth rereading, sometimes a small instruction for the week ahead.
        </p>
        <p>
          Free, ad-free, never sold or shared. Unsubscribe at any time, with no hard feelings.
        </p>
      </div>
      <InlineNewsletter />
    </SiteLayout>
  );
}
