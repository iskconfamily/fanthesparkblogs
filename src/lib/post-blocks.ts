// Shared block-document model for posts.
// Used by the renderer (home + post page + preview), the AI chat designer,
// and the database (blog_posts.blocks JSONB).

export type GalleryImage = { src: string; alt?: string; caption?: string };

export type PostBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading"; level?: 2 | 3; text: string }
  | { id: string; type: "quote"; text: string; cite?: string }
  | { id: string; type: "pull-quote"; text: string; cite?: string }
  | {
      id: string;
      type: "image";
      src: string;
      alt?: string;
      caption?: string;
      layout?: "hero" | "full" | "side-right" | "side-left" | "inline-small";
    }
  | {
      id: string;
      type: "image-text";
      src: string;
      alt?: string;
      caption?: string;
      text: string;
      imageSide?: "left" | "right";
    }
  | {
      id: string;
      type: "gallery";
      images: GalleryImage[];
      columns?: 2 | 3;
    }
  | { id: string; type: "divider" }
  | { id: string; type: "callout"; tone?: "note" | "warning"; text: string }
  | { id: string; type: "newsletter-cta" };

export type PostBlockType = PostBlock["type"];

export function makeBlockId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function parseGalleryImages(value: unknown): GalleryImage[] {
  if (!Array.isArray(value)) return [];
  const out: GalleryImage[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    if (typeof r.src !== "string" || !r.src) continue;
    out.push({
      src: r.src,
      alt: typeof r.alt === "string" ? r.alt : "",
      caption: typeof r.caption === "string" ? r.caption : undefined,
    });
  }
  return out;
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
    } else if (type === "pull-quote" && typeof r.text === "string") {
      out.push({ id, type, text: r.text, cite: typeof r.cite === "string" ? r.cite : undefined });
    } else if (type === "image" && typeof r.src === "string") {
      const layoutOk = ["hero", "full", "side-right", "side-left", "inline-small"].includes(
        String(r.layout),
      );
      out.push({
        id,
        type,
        src: r.src,
        alt: typeof r.alt === "string" ? r.alt : "",
        caption: typeof r.caption === "string" ? r.caption : undefined,
        layout: (layoutOk ? r.layout : "hero") as
          | "hero"
          | "full"
          | "side-right"
          | "side-left"
          | "inline-small",
      });
    } else if (type === "image-text" && typeof r.src === "string" && typeof r.text === "string") {
      out.push({
        id,
        type,
        src: r.src,
        text: r.text,
        alt: typeof r.alt === "string" ? r.alt : "",
        caption: typeof r.caption === "string" ? r.caption : undefined,
        imageSide: r.imageSide === "left" ? "left" : "right",
      });
    } else if (type === "gallery") {
      const images = parseGalleryImages(r.images);
      if (images.length === 0) continue;
      const columns = r.columns === 3 ? 3 : 2;
      out.push({ id, type, images, columns });
    } else if (type === "divider") {
      out.push({ id, type });
    } else if (type === "callout" && typeof r.text === "string") {
      out.push({
        id,
        type,
        tone: r.tone === "warning" ? "warning" : "note",
        text: r.text,
      });
    } else if (type === "newsletter-cta") {
      out.push({ id, type });
    }
  }
  return out;
}
