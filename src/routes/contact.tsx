import { createFileRoute } from "@tanstack/react-router";
import { SiteLayoutMarketing } from "@/components/site-layout-marketing";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Fan The Spark" },
      { name: "description", content: "Get in touch with Fan The Spark." },
      { property: "og:title", content: "Contact — Fan The Spark" },
      { property: "og:description", content: "Get in touch with Fan The Spark." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayoutMarketing>
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <p
          className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          Get in touch
        </p>
        <h1
          className="text-5xl italic mb-8"
          style={{ fontFamily: "var(--font-serif-display)" }}
        >
          Contact
        </h1>
        <p
          className="text-[19px] leading-[1.8] text-muted-foreground"
          style={{ fontFamily: "var(--font-serif-body)" }}
        >
          Contact details and form coming soon.
        </p>
      </div>
    </SiteLayoutMarketing>
  );
}
