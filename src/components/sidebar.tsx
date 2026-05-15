import { Link } from "@tanstack/react-router";
import { getAllPosts, getAllTags } from "@/content/queries";
import { tagSlug } from "@/content/posts";
import postKhatvanga from "@/assets/post-khatvanga.jpg";
import postAtma from "@/assets/post-atma.jpg";
import postGratitude from "@/assets/post-gratitude.jpg";
import postRabbits from "@/assets/post-rabbits.jpg";
import postSunshine from "@/assets/post-sunshine.jpg";
import postWholy from "@/assets/post-wholy.jpg";

const favoriteBooks = [
  {
    title: "Our Family Business",
    author: "Vaisesika Dasa",
    href: "https://www.amazon.com/Our-Family-Business-Vaisesika-Dasa/dp/9171499008",
  },
  {
    title: "The Four Questions",
    author: "A book of essential inquiry",
    href: "https://thefourquestionsbook.com/",
  },
];

const tiles = [
  { src: postKhatvanga, slug: "the-khatvanga-moment", title: "The Khatvanga Moment" },
  { src: postAtma, slug: "you-are-an-atma", title: "You Are an Atma" },
  { src: postGratitude, slug: "cultivate-gratitude", title: "Cultivate Gratitude" },
  { src: postRabbits, slug: "two-rabbits", title: "Two Rabbits" },
  { src: postSunshine, slug: "sunshine-energy-in-unlimited-flavors", title: "Sunshine Energy" },
  { src: postWholy, slug: "are-you-wholy", title: "Are You Wholy?" },
];

export function Sidebar() {
  const recent = getAllPosts().slice(0, 5);
  const tags = getAllTags();

  return (
    <aside
      className="space-y-12 text-[15px]"
      style={{ fontFamily: "var(--font-serif-body)" }}
    >
      {/* Featured book */}
      <section>
        <SectionLabel>Currently Reading</SectionLabel>
        <Link
          to="/post/$slug"
          params={{ slug: "the-khatvanga-moment" }}
          className="block no-underline"
          style={{ borderBottom: "none" }}
        >
          <img
            src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80"
            alt="A worn book on a wooden table."
            className="w-full"
          />
          <p className="mt-3 italic text-foreground" style={{ fontFamily: "var(--font-serif-display)" }}>
            A Field Guide to the Inner Weather
          </p>
          <p className="text-sm text-muted-foreground">A slow anthology of essays for the long evening.</p>
        </Link>
      </section>

      {/* Favorite Reads */}
      <section>
        <SectionLabel>Favorite Reads</SectionLabel>
        <ul className="space-y-4 mb-6">
          {favoriteBooks.map((b) => (
            <li key={b.title}>
              <a
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="italic"
                style={{ fontFamily: "var(--font-serif-display)" }}
              >
                {b.title}
              </a>
              <p className="text-sm text-muted-foreground">{b.author}</p>
            </li>
          ))}
        </ul>

        {/* Article tiles */}
        <div className="grid grid-cols-2 gap-3">
          {tiles.map((t) => (
            <Link
              key={t.slug}
              to="/post/$slug"
              params={{ slug: t.slug }}
              className="block no-underline group"
              style={{ borderBottom: "none" }}
              title={t.title}
            >
              <img
                src={t.src}
                alt={t.title}
                className="w-full aspect-square object-cover transition-opacity group-hover:opacity-80"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-y border-border py-6">
        <SectionLabel>The Sunday Letter</SectionLabel>
        <p className="text-sm text-muted-foreground mb-3">
          One quiet essay, every Sunday morning. Free. No tracking.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-2"
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

      {/* Social */}
      <section>
        <SectionLabel>Connect</SectionLabel>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="https://www.facebook.com/FanTheSpark/" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/FanTheSpark" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li><a href="#" onClick={(e) => e.preventDefault()}>RSS Feed</a></li>
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
