import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getPostById } from "@/lib/admin.functions";
import { BlockChat } from "@/components/admin/block-chat";
import { BlockPreview } from "@/components/admin/block-preview";
import { dbPostToPost } from "@/lib/blog-adapter";
import type { PostBlock } from "@/lib/post-blocks";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/design/$id")({
  component: DesignPage,
});

function DesignPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const fetchPost = useServerFn(getPostById);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-post-design", id],
    queryFn: () => fetchPost({ data: { id } }),
  });

  const [blocks, setBlocks] = useState<PostBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.blocks) setBlocks(data.blocks);
  }, [data?.blocks]);

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!data) return <p className="text-muted-foreground">Post not found.</p>;

  const post = dbPostToPost(data);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl italic" style={{ fontFamily: "var(--font-serif-display)" }}>
            Designing: {post.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            What you design here is exactly what shows up on the home page card
            and the post detail page.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/edit/$id" params={{ id }}>
            <Button variant="outline" size="sm">Open text editor</Button>
          </Link>
          <Button
            size="sm"
            onClick={() => router.navigate({ to: `/preview/${post.slug}` })}
          >
            Save &amp; preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 min-h-[80vh]">
        <BlockPreview
          post={post}
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
        />

        <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <BlockChat
            postId={id}
            selectedBlockId={selectedBlockId}
            onBlocksUpdated={(b) => {
              setBlocks(b);
              // Clear selection if the previously selected block was removed.
              if (selectedBlockId && !b.find((x) => x.id === selectedBlockId)) {
                setSelectedBlockId(null);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
