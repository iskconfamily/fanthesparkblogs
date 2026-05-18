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
            className="text-3xl md:text-4xl"
            style={{
              fontFamily: "var(--font-serif-display)",
              fontWeight: 600,
              fontVariant: "small-caps",
              letterSpacing: "0.08em",
              color: "#7e6c2a",
              backgroundImage:
                "linear-gradient(180deg, transparent 0%, transparent 38%, #f2e199 38%, #efd9b4 100%)",
              padding: "0.35em 0.7em 0.4em",
              borderRadius: "3px",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}
          >
            Fan The Spark
          </h1>
        </Link>
      </div>
    </header>
  );
}
