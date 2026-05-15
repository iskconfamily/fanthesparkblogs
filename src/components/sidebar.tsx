import { Link } from "@tanstack/react-router";
import { getAllPosts, getAllTags } from "@/content/queries";
import { tagSlug } from "@/content/posts";

const recommended = [
  {
    title: "On Solitude",
    author: "M. Quennell",
    src: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=200&auto=format&fit=crop&q=80",
  },
  {
    title: "Letters to the Garden",
    author: "Iris Holloway",
    src: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&auto=format&fit=crop&q=80",
  },
  {
    title: "The Lighted Room",
    author: "F. Aldous",
    src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&auto=format&fit=crop&q=80",
  },
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

      {/* Recommended */}
      <section>
        <SectionLabel>Favorite Reads</SectionLabel>
        <ul className="space-y-4">
          {recommended.map((b) => (
            <li key={b.title} className="flex gap-3">
              <img src={b.src} alt={b.title} className="w-12 h-16 object-cover flex-shrink-0" />
              <div className="text-sm">
                <p className="italic" style={{ fontFamily: "var(--font-serif-display)" }}>{b.title}</p>
                <p className="text-muted-foreground">{b.author}</p>
              </div>
            </li>
          ))}
        </ul>
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
        <SectionLabel>Elsewhere</SectionLabel>
        <ul className="space-y-2 text-sm">
          <li><a href="#" onClick={(e) => e.preventDefault()}>RSS Feed</a></li>
          <li><a href="#" onClick={(e) => e.preventDefault()}>By Email</a></li>
          <li><a href="#" onClick={(e) => e.preventDefault()}>On Mastodon</a></li>
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
