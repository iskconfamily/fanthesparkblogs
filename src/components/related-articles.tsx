import { Link } from "@tanstack/react-router";
import type { Post } from "@/content/posts";

export function RelatedArticles({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section className="mt-16 pt-10 border-t border-border">
      <p
        className="mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        You might also like
      </p>
      <ul className="grid gap-8 sm:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              to="/post/$slug"
              params={{ slug: p.slug }}
              className="block no-underline"
              style={{ borderBottom: "none" }}
            >
              <img src={p.featuredImage.src} alt={p.featuredImage.alt} className="w-full mb-3 aspect-[4/3] object-cover" />
              <p
                className="italic text-lg leading-tight"
                style={{ fontFamily: "var(--font-serif-display)" }}
              >
                {p.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
