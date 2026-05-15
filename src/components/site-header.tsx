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

    </header>
  );
}

