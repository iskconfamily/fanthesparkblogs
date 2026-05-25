import type { Post } from "@/content/posts";
import type { PostBlock } from "@/lib/post-blocks";

/**
 * Normalize a Post into PostBlock[]. If blocks are present, return them.
 * Otherwise convert the legacy `body` array (p / h2 / quote / figure) into blocks.
 */
export function postToBlocks(post: Post): PostBlock[] {
  if (post.blocks && post.blocks.length) return post.blocks;
  return post.body.map((b, i): PostBlock => {
    if (b.type === "p") return { id: `b-p-${i}`, type: "paragraph", text: b.text };
    if (b.type === "h2") return { id: `b-h-${i}`, type: "heading", level: 2, text: b.text };
    if (b.type === "quote")
      return { id: `b-q-${i}`, type: "quote", text: b.text, cite: b.cite };
    return {
      id: `b-f-${i}`,
      type: "image",
      src: b.src,
      alt: b.alt,
      caption: b.caption,
      layout: "full",
    };
  });
}
