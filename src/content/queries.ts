import { posts, type Post } from "./posts";

export const getAllPosts = (): Post[] =>
  [...posts].sort((a, b) => b.date.localeCompare(a.date));

export const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);

export const getPostsByTag = (tag: string): Post[] =>
  getAllPosts().filter(
    (p) =>
      p.tags.includes(tag.toLowerCase()) ||
      p.category.toLowerCase() === tag.toLowerCase()
  );

export const getRelated = (post: Post): Post[] => {
  const explicit = (post.relatedSlugs ?? [])
    .map(getPostBySlug)
    .filter(Boolean) as Post[];
  if (explicit.length) return explicit;
  return getAllPosts()
    .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);
};

export const getRandomPost = (): Post => {
  const all = getAllPosts();
  return all[Math.floor(Math.random() * all.length)];
};

export const getAllTags = (): { tag: string; count: number }[] => {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags) map.set(t, (map.get(t) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
};

export const formatDate = (iso: string): string =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
