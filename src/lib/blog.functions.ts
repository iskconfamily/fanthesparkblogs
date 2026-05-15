import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { dbPostToPost, type DbBlogPost } from "./blog-adapter";

// Public: published posts only. Uses admin client with explicit status filter
// (RLS-equivalent gate enforced server-side) so SSR/prerender works without auth.
export const getPublishedDbPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("getPublishedDbPosts error:", error);
    return [] as ReturnType<typeof dbPostToPost>[];
  }
  return (data as DbBlogPost[]).map(dbPostToPost);
});

export const getPublishedDbPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(255) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error || !row) return null;
    return dbPostToPost(row as DbBlogPost);
  });
