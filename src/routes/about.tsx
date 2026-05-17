import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Fan The Spark" },
      { name: "description", content: "About this small, slow literary publication." },
      { property: "og:title", content: "About — Fan The Spark" },
      { property: "og:description", content: "About this small, slow literary publication." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <article>
        <p
          className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          Colophon
        </p>
        <h1 className="text-5xl italic mb-8" style={{ fontFamily: "var(--font-serif-display)" }}>
          About Fan The Spark
        </h1>
        <div
          className="prose-literary text-[19px] leading-[1.8] space-y-6"
          style={{ fontFamily: "var(--font-serif-body)" }}
        >
          <p>
            Fan The Spark is a small, independent literary journal devoted to the long, quiet essay — to the kinds of writing that ask you to stay with a single thought for the length of a winter afternoon.
          </p>
          <p>
            We publish irregularly and unhurriedly. New essays appear when they are ready, generally a few times a month. The site is hand-coded, ad-free, and intentionally slow. There is no algorithm here, only a person and a few books.
          </p>
          <p>
            We write about poetry, books, attention, friendship, the natural world, the inner weather of ordinary days. We are interested in what is beautiful, what is difficult, and what asks to be read more than once.
          </p>
          <p>
            If you would like a quiet essay in your inbox each Sunday morning, you can{" "}
            <a href="/newsletter">subscribe to the Sunday Letter</a>. If you would like to wander, the <a href="/archive">archive</a> is open.
          </p>
        </div>
      </article>
    </SiteLayout>
  );
}
