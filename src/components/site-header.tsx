import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { TAGS, tagSlug } from "@/content/posts";

const PRIMARY = ["Bhakti Notes", "Intelligent Inquiries", "Spiritual Fitness", "Wisdom"] as const;
const MORE = TAGS.filter((t) => !PRIMARY.includes(t as (typeof PRIMARY)[number]));

export function SiteHeader() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-[1200px] px-6 pt-12 pb-6 text-center">
        <Link to="/" className="no-underline inline-block" style={{ borderBottom: "none" }}>
          <h1
            className="text-5xl md:text-6xl italic tracking-tight"
            style={{ fontFamily: "var(--font-serif-display)", fontWeight: 500 }}
          >
            sravaṇādi jala
          </h1>
        </Link>
        <p
          className="mt-3 text-sm uppercase tracking-[0.22em] text-muted-foreground"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          sprinkling the water of hearing &amp; chanting
        </p>
      </div>

      <nav className="border-t border-border relative">
        <ul
          className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-7 gap-y-2 px-6 py-4 text-[12px] uppercase tracking-[0.22em]"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          <li>
            <Link
              to="/"
              className="text-foreground hover:text-primary"
              style={{ borderBottom: "none" }}
              activeProps={{ style: { color: "var(--color-primary)", borderBottom: "none" } }}
              activeOptions={{ exact: true }}
            >
              All
            </Link>
          </li>
          {PRIMARY.map((label) => (
            <li key={label}>
              <Link
                to="/tag/$slug"
                params={{ slug: tagSlug(label) }}
                className="text-foreground hover:text-primary"
                style={{ borderBottom: "none" }}
                activeProps={{ style: { color: "var(--color-primary)", borderBottom: "none" } }}
              >
                {label}
              </Link>
            </li>
          ))}

          <li className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="bg-primary text-primary-foreground px-3 py-1.5 uppercase tracking-[0.22em] hover:opacity-90"
              style={{ fontFamily: "var(--font-meta)", fontSize: "12px" }}
              aria-expanded={moreOpen}
            >
              More <span className="ml-1">▾</span>
            </button>
            {moreOpen && (
              <ul
                className="absolute right-0 top-full z-20 mt-1 min-w-[260px] border border-border bg-card text-right shadow-md"
                style={{ fontFamily: "var(--font-meta)" }}
              >
                {MORE.map((label) => (
                  <li key={label}>
                    <Link
                      to="/tag/$slug"
                      params={{ slug: tagSlug(label) }}
                      onClick={() => setMoreOpen(false)}
                      className="block px-5 py-3 text-[12px] uppercase tracking-[0.22em] text-foreground hover:text-primary hover:bg-accent"
                      style={{ borderBottom: "none" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/archive"
                    onClick={() => setMoreOpen(false)}
                    className="block px-5 py-3 text-[12px] uppercase tracking-[0.22em] text-foreground hover:text-primary hover:bg-accent border-t border-border"
                    style={{ borderBottom: "none" }}
                  >
                    Archive
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    onClick={() => setMoreOpen(false)}
                    className="block px-5 py-3 text-[12px] uppercase tracking-[0.22em] text-foreground hover:text-primary hover:bg-accent"
                    style={{ borderBottom: "none" }}
                  >
                    About
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
