import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/fts-logo.png";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-[1200px] px-6 pt-12 pb-6 text-center">
        <Link to="/" className="no-underline inline-block" style={{ borderBottom: "none" }}>
          <img
            src={logoUrl}
            alt="Fan The Spark"
            className="mx-auto mb-4 h-24 w-24 object-contain"
          />
          <h1
            className="text-5xl md:text-6xl tracking-tight"
            style={{ fontFamily: "var(--font-display-sans)", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Fan The Spark
          </h1>
        </Link>
      </div>
    </header>
  );
}
