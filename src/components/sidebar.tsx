import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Instagram, Rss } from "lucide-react";
import { getAllPosts, getAllTags } from "@/content/queries";
import { tagSlug } from "@/content/posts";
import postKhatvanga from "@/assets/post-khatvanga.jpg";
import postAtma from "@/assets/post-atma.jpg";
import postGratitude from "@/assets/post-gratitude.jpg";
import postRabbits from "@/assets/post-rabbits.jpg";
import postSunshine from "@/assets/post-sunshine.jpg";
import postWholy from "@/assets/post-wholy.jpg";
import postFamilyBusiness from "@/assets/post-family-business.jpg";
import postFourQuestions from "@/assets/post-four-questions.jpg";

const tiles = [
  { src: postKhatvanga, slug: "the-khatvanga-moment", title: "The Khatvanga Moment" },
  { src: postAtma, slug: "you-are-an-atma", title: "You Are an Atma" },
  { src: postGratitude, slug: "cultivate-gratitude", title: "Cultivate Gratitude" },
  { src: postRabbits, slug: "two-rabbits", title: "Two Rabbits" },
  { src: postSunshine, slug: "sunshine-energy-in-unlimited-flavors", title: "Sunshine Energy" },
  { src: postWholy, slug: "are-you-wholy", title: "Are You Wholy?" },
];

const books = [
  {
    src: postFamilyBusiness,
    slug: "our-family-business",
    title: "Our Family Business",
    author: "Vaisesika Dasa",
  },
  {
    src: postFourQuestions,
    slug: "the-four-questions",
    title: "The Four Questions",
    author: "A book of essential inquiry",
  },
];

export function Sidebar() {
  const recent = getAllPosts().slice(0, 5);
  const tags = getAllTags();
  const [orderedTiles, setOrderedTiles] = useState(tiles);

  useEffect(() => {
    const shuffled = [...tiles].sort(() => Math.random() - 0.5);
    setOrderedTiles(shuffled);
  }, []);

  return (
    <aside
      className="space-y-12 text-[17px]"
      style={{ fontFamily: "var(--font-serif-body)" }}
    >
      {/* Article tiles — one per row, image + title */}
      <section>
        <ul className="space-y-5">
          {orderedTiles.map((t) => (
            <li key={t.slug}>
              <Link
                to="/post/$slug"
                params={{ slug: t.slug }}
                className="block no-underline group"
                style={{ borderBottom: "none" }}
              >
                <img
                  src={t.src}
                  alt={t.title}
                  className="w-full aspect-[4/3] object-cover transition-opacity group-hover:opacity-85"
                  loading="lazy"
                />
                <p
                  className="mt-2 text-lg italic text-foreground leading-snug"
                  style={{ fontFamily: "var(--font-serif-display)" }}
                >
                  {t.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Books */}
      <section>
        <SectionLabel>Books</SectionLabel>
        <ul className="space-y-6">
          {books.map((b) => (
            <li key={b.slug}>
              <Link
                to="/post/$slug"
                params={{ slug: b.slug }}
                className="block no-underline group"
                style={{ borderBottom: "none" }}
              >
                <img
                  src={b.src}
                  alt={b.title}
                  className="w-full aspect-[3/4] object-cover transition-opacity group-hover:opacity-85"
                  loading="lazy"
                />
                <p
                  className="mt-2 italic text-foreground leading-snug"
                  style={{ fontFamily: "var(--font-serif-display)" }}
                >
                  {b.title}
                </p>
                <p className="text-sm text-muted-foreground">{b.author}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Newsletter */}
      <section className="border-y border-border py-6">
        <SectionLabel>Newsletter</SectionLabel>
        <p className="text-sm text-muted-foreground mb-3">
          Get the blogs delivered to your email.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-2"
          suppressHydrationWarning
        >
          <input
            type="email"
            placeholder="your@email"
            className="border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
            style={{ fontFamily: "var(--font-serif-body)" }}
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-3 py-2 text-xs uppercase tracking-[0.18em] hover:opacity-90"
            style={{ fontFamily: "var(--font-meta)" }}
          >
            Subscribe
          </button>
        </form>

        {/* Social — beneath the newsletter form */}
        <div className="mt-8">
          <SectionLabel>Connect</SectionLabel>
          <ul className="grid grid-cols-2 gap-y-3 gap-x-4 text-[15px]">
            <li>
              <a
                href="https://www.facebook.com/FanTheSpark/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 no-underline"
                style={{ borderBottom: "none" }}
              >
                <Facebook className="h-4 w-4" strokeWidth={1.5} />
                <span style={{ fontFamily: "var(--font-serif-display)" }}>Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/FanTheSpark"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 no-underline"
                style={{ borderBottom: "none" }}
              >
                <Youtube className="h-4 w-4" strokeWidth={1.5} />
                <span style={{ fontFamily: "var(--font-serif-display)" }}>YouTube</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/fanthesparkcom/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 no-underline"
                style={{ borderBottom: "none" }}
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
                <span style={{ fontFamily: "var(--font-serif-display)" }}>Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 no-underline"
                style={{ borderBottom: "none" }}
              >
                <Rss className="h-4 w-4" strokeWidth={1.5} />
                <span style={{ fontFamily: "var(--font-serif-display)" }}>RSS</span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* Recent essays */}
      <section>
        <SectionLabel>Recent Essays</SectionLabel>
        <ul className="space-y-3 text-sm">
          {recent.map((p) => (
            <li key={p.slug}>
              <Link
                to="/post/$slug"
                params={{ slug: p.slug }}
                className="italic"
                style={{ fontFamily: "var(--font-serif-display)" }}
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Tags */}
      <section>
        <SectionLabel>Categories</SectionLabel>
        <ul className="space-y-2 text-sm">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link to="/tag/$slug" params={{ slug: tagSlug(tag) }}>
                {tag}
              </Link>
              <span className="text-muted-foreground ml-2">({count})</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
      style={{ fontFamily: "var(--font-meta)" }}
    >
      {children}
    </p>
  );
}
