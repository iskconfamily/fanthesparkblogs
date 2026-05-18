import type { PostBlock } from "@/lib/post-blocks";
import type { Post } from "@/content/posts";
import { PostArticle } from "@/components/post-article";

/**
 * Renders the post exactly as it would appear on the home page and post page,
 * but each block is wrapped in a click-target so the user can "select" a
 * specific block and scope chat instructions to it.
 */
export function BlockPreview({
  post,
  blocks,
  selectedBlockId,
  onSelectBlock,
}: {
  post: Post;
  blocks: PostBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
}) {
  // Synthesize a Post object so PostArticle renders the latest blocks.
  const previewPost: Post = { ...post, blocks };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="uppercase tracking-wide">Live preview</span>
        {selectedBlockId && (
          <button
            type="button"
            className="underline hover:text-foreground"
            onClick={() => onSelectBlock(null)}
          >
            Clear selection
          </button>
        )}
      </div>

      <article className="border border-border rounded-md p-6 bg-background">
        <PostArticle post={previewPost} as="h1" titleClassName="text-3xl md:text-4xl" />
      </article>

      <div className="border border-border rounded-md p-3 bg-muted/30">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
          Blocks ({blocks.length}) — click to select
        </p>
        <ol className="space-y-1">
          {blocks.map((b, i) => {
            const label =
              b.type === "paragraph" ? `¶ ${b.text.slice(0, 60)}${b.text.length > 60 ? "…" : ""}` :
              b.type === "heading" ? `H${b.level ?? 2}  ${b.text}` :
              b.type === "quote" ? `❝ ${b.text.slice(0, 60)}${b.text.length > 60 ? "…" : ""}` :
              b.type === "image" ? `🖼  ${b.layout ?? "hero"} — ${b.alt || b.src.slice(-40)}` :
              b.type === "divider" ? "— divider —" :
              b.type === "callout" ? `! callout: ${b.text.slice(0, 60)}` : "?";
            const selected = b.id === selectedBlockId;
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => onSelectBlock(selected ? null : b.id)}
                  className={`w-full text-left text-xs px-2 py-1 rounded font-mono truncate ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-background text-muted-foreground"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}. {label}
                </button>
              </li>
            );
          })}
          {blocks.length === 0 && (
            <li className="text-xs italic text-muted-foreground">
              Empty post. Ask the chat to add some blocks.
            </li>
          )}
        </ol>
      </div>
    </div>
  );
}
