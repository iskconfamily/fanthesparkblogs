import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/fts-logo.png";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-[1200px] px-6 pt-12 pb-6">
        <Link
          to="/"
          className="no-underline flex items-center justify-center gap-4"
          style={{ borderBottom: "none" }}
        >
          <img
            src={logoUrl}
            alt="Fan The Spark"
            className="h-16 w-16 object-contain"
          />
          <h1
            className="text-4xl md:text-5xl tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-serif-display)", fontWeight: 500 }}
          >
            Fan The Spark
          </h1>
        </Link>
      </div>
    </header>
  );
}
