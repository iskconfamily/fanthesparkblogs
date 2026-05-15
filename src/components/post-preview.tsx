import { Link } from "@tanstack/react-router";
import type { Post } from "@/content/posts";
import { tagSlug } from "@/content/posts";
import { formatDate } from "@/content/queries";

export function PostPreview({ post }: { post: Post }) {
  return (
    <article className="border-b border-border pb-12 mb-12 last:border-b-0">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {post.tags.map((t) => (
          <Link
            key={t}
            to="/tag/$slug"
            params={{ slug: tagSlug(t) }}
            className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-primary"
            style={{ fontFamily: "var(--font-meta)", borderBottom: "none" }}
          >
            {t}
          </Link>
        ))}
      </div>
      <h2 className="mt-2 mb-2">
        <Link
          to="/post/$slug"
          params={{ slug: post.slug }}
          className="text-3xl md:text-4xl italic text-foreground hover:text-primary"
          style={{
            fontFamily: "var(--font-serif-display)",
            fontWeight: 500,
            borderBottom: "none",
            display: "inline-block",
            lineHeight: 1.15,
          }}
        >
          {post.title}
        </Link>
      </h2>
      <p
        className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-5"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        {formatDate(post.date)}
      </p>
      <Link
        to="/post/$slug"
        params={{ slug: post.slug }}
        className="block mb-5 no-underline"
        style={{ borderBottom: "none" }}
      >
        <img
          src={post.featuredImage.src}
          alt={post.featuredImage.alt}
          className="w-full"
          loading="lazy"
        />
      </Link>
      <p className="text-foreground/90 leading-[1.8]">{post.excerpt}</p>
      <p className="mt-4">
        <Link to="/post/$slug" params={{ slug: post.slug }} className="text-sm italic">
          Continue reading →
        </Link>
      </p>
    </article>
  );
}
