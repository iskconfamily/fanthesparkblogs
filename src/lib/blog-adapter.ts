import type { Post, ArticleBlock } from "@/content/posts";

export type DbBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  category: string | null;
  author: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200";

function parseContent(content: string | null): ArticleBlock[] {
  if (!content) return [];
  return content
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): ArticleBlock => {
      if (chunk.startsWith("## ")) return { type: "h2", text: chunk.slice(3).trim() };
      if (chunk.startsWith("> ")) return { type: "quote", text: chunk.slice(2).trim() };
      return { type: "p", text: chunk };
    });
}

export function dbPostToPost(row: DbBlogPost): Post {
  const date = (row.published_at ?? row.created_at).slice(0, 10);
  const category = row.category ?? "Bhakti Notes";
  return {
    slug: row.slug,
    title: row.title,
    category,
    tags: [category],
    date,
    author: row.author ?? undefined,
    excerpt: row.excerpt ?? "",
    featuredImage: {
      src: row.featured_image || FALLBACK_IMG,
      alt: row.title,
    },
    imageLayout: "hero",
    body: parseContent(row.content),
  };
}
