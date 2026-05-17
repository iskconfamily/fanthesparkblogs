import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div
        className="mx-auto max-w-[1200px] px-6 py-10 text-center text-sm text-muted-foreground"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        <p className="italic">
          Sprinkling the water of hearing &amp; chanting, quietly and irregularly.
        </p>
        <p className="mt-3 space-x-4 no-underline">
          <Link to="/about" style={{ borderBottom: "none" }}>About</Link>
          <Link to="/archive" style={{ borderBottom: "none" }}>Archive</Link>
          <Link to="/newsletter" style={{ borderBottom: "none" }}>Newsletter</Link>
          <Link to="/tag/$slug" params={{ slug: "bhakti-notes" }} style={{ borderBottom: "none" }}>Bhakti Notes</Link>
          <Link to="/tag/$slug" params={{ slug: "wisdom" }} style={{ borderBottom: "none" }}>Wisdom</Link>
        </p>
        <p className="mt-6 text-xs">© {new Date().getFullYear()} Fan The Spark. All essays original.</p>
      </div>
    </footer>
  );
}
