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
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  image_prompts: ImagePrompt[];
  image_layout?: "hero" | "side" | "none" | null;
  announcement_sent_at?: string | null;
  announcement_recipient_count?: number | null;
};

export type ImagePrompt = {
  prompt: string;
  alt?: string;
  url?: string; // populated once generated
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200";

// Parses our markdown-ish content. Supports:
//  ## heading
//  > quote
//  ![alt](url) figure on its own line/block
function parseContent(content: string | null): ArticleBlock[] {
  if (!content) return [];
  return content
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): ArticleBlock => {
      if (chunk.startsWith("## ")) return { type: "h2", text: chunk.slice(3).trim() };
      if (chunk.startsWith("> ")) return { type: "quote", text: chunk.slice(2).trim() };
      const fig = chunk.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (fig) return { type: "figure", src: fig[2], alt: fig[1] || "" };
      return { type: "p", text: chunk };
    });
}

export function dbPostToPost(row: DbBlogPost): Post {
  const date = (row.published_at ?? row.created_at).slice(0, 10);
  const category = row.category ?? "Bhakti Notes";
  const tags = row.tags && row.tags.length ? row.tags : [category];
  return {
    slug: row.slug,
    title: row.title,
    category,
    tags,
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
