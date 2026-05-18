import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatDesignPost } from "@/lib/admin.functions";
import type { PostBlock } from "@/lib/post-blocks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatMsg = { role: "user" | "assistant"; content: string };

export function BlockChat({
  postId,
  selectedBlockId,
  onBlocksUpdated,
}: {
  postId: string;
  selectedBlockId: string | null;
  onBlocksUpdated: (blocks: PostBlock[]) => void;
}) {
  const chat = useServerFn(chatDesignPost);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Describe how you'd like this post to look. For example: \"put a small image of the four questions on the right of paragraph 2\", \"make the third image full-width\", \"add a quote callout after the heading\".",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy]);

  const send = async () => {
    if (!input.trim() || busy) return;
    const userMsg: ChatMsg = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    setError("");
    try {
      const res = await chat({
        data: {
          id: postId,
          messages: nextMessages
            // drop the initial system-y assistant greeting from server context
            .filter((_, i) => !(i === 0 && nextMessages[0].role === "assistant"))
            .slice(-20),
          selectedBlockId: selectedBlockId ?? undefined,
        },
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.message }]);
      onBlocksUpdated(res.blocks as PostBlock[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chat failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col h-full border border-border rounded-md bg-background">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm uppercase tracking-wide text-muted-foreground">Design chat</h2>
        {selectedBlockId && (
          <p className="text-[11px] text-primary mt-0.5">
            Block selected — instructions will scope to it.
          </p>
        )}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm rounded-md p-3 ${
              m.role === "user"
                ? "bg-primary/10 text-foreground ml-6"
                : "bg-muted text-foreground mr-6"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
              {m.role}
            </p>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
        {busy && (
          <div className="text-xs text-muted-foreground italic mr-6">Designing…</div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <div className="border-t border-border p-3 space-y-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="e.g. Move the lamp image to the right of the second paragraph and make it small."
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              send();
            }
          }}
          disabled={busy}
        />
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">⌘/Ctrl + Enter to send</p>
          <Button size="sm" onClick={send} disabled={busy || !input.trim()}>
            {busy ? "Working…" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
