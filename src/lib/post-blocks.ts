// Shared block-document model for posts.
// Used by the renderer (home + post page + preview), the AI chat designer,
// and the database (blog_posts.blocks JSONB).

export type PostBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading"; level?: 2 | 3; text: string }
  | { id: string; type: "quote"; text: string; cite?: string }
  | {
      id: string;
      type: "image";
      src: string;
      alt?: string;
      caption?: string;
      /**
       * hero: large, full column, sits inline.
       * full: same as hero but stylistically can be edge-to-edge later.
       * side-right / side-left: floats so following paragraphs wrap around it.
       * inline-small: centered, ~60% width, inline.
       */
      layout?: "hero" | "full" | "side-right" | "side-left" | "inline-small";
    }
  | { id: string; type: "divider" }
  | { id: string; type: "callout"; tone?: "note" | "warning"; text: string };

export type PostBlockType = PostBlock["type"];

export function makeBlockId(): string {
  // Stable enough for client-side; server uses gen_random_uuid for DB rows.
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Normalize raw JSON from the DB into a typed block array. Drops malformed entries. */
export function parseBlocks(value: unknown): PostBlock[] {
  if (!Array.isArray(value)) return [];
  const out: PostBlock[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const id = typeof r.id === "string" && r.id ? r.id : makeBlockId();
    const type = r.type;
    if (type === "paragraph" && typeof r.text === "string") {
      out.push({ id, type, text: r.text });
    } else if (type === "heading" && typeof r.text === "string") {
      const level = r.level === 3 ? 3 : 2;
      out.push({ id, type, level, text: r.text });
    } else if (type === "quote" && typeof r.text === "string") {
      out.push({ id, type, text: r.text, cite: typeof r.cite === "string" ? r.cite : undefined });
    } else if (type === "image" && typeof r.src === "string") {
      const layout = ["hero", "full", "side-right", "side-left", "inline-small"].includes(
        String(r.layout),
      )
        ? (r.layout as PostBlock & { type: "image" }) // narrow
        : undefined;
      out.push({
        id,
        type,
        src: r.src,
        alt: typeof r.alt === "string" ? r.alt : "",
        caption: typeof r.caption === "string" ? r.caption : undefined,
        layout: (layout as unknown as "hero" | "full" | "side-right" | "side-left" | "inline-small" | undefined) ?? "hero",
      });
    } else if (type === "divider") {
      out.push({ id, type });
    } else if (type === "callout" && typeof r.text === "string") {
      out.push({
        id,
        type,
        tone: r.tone === "warning" ? "warning" : "note",
        text: r.text,
      });
    }
  }
  return out;
}
