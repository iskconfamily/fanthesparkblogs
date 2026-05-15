import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div
        className="mx-auto max-w-[1200px] px-6 py-10 text-center text-sm text-muted-foreground"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        <p className="italic">
          Published quietly, irregularly, and with affection since the present.
        </p>
        <p className="mt-3 space-x-4 no-underline">
          <Link to="/about" style={{ borderBottom: "none" }}>About</Link>
          <Link to="/archive" style={{ borderBottom: "none" }}>Archive</Link>
          <Link to="/newsletter" style={{ borderBottom: "none" }}>Newsletter</Link>
          <Link to="/tag/poetry" style={{ borderBottom: "none" }}>Poetry</Link>
          <Link to="/tag/books" style={{ borderBottom: "none" }}>Books</Link>
        </p>
        <p className="mt-6 text-xs">© {new Date().getFullYear()} The Marginalia. All essays original.</p>
      </div>
    </footer>
  );
}
