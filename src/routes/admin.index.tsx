import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { listAllPosts, setPostStatus, deletePost, savePost } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { posts as staticPosts, type Post, type ArticleBlock } from "@/content/posts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminList,
});

function blocksToMarkdown(blocks: ArticleBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === "h2") return `## ${b.text}`;
      if (b.type === "quote") return `> ${b.text}`;
      if (b.type === "figure") return `![${b.alt}](${b.src})`;
      return b.text;
    })
    .join("\n\n");
}

function staticToSavePayload(p: Post) {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? "",
    content: blocksToMarkdown(p.body),
    featured_image: typeof p.featuredImage.src === "string" ? p.featuredImage.src : "",
    category: p.category ?? "",
    author: p.author ?? "",
    status: "published" as const,
    tags: p.tags ?? [],
  };
}

function AdminList() {
  const router = useRouter();
  const fetchPosts = useServerFn(listAllPosts);
  const setStatus = useServerFn(setPostStatus);
  const del = useServerFn(deletePost);
  const save = useServerFn(savePost);
  const [importing, setImporting] = useState(false);

  const { data: posts = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => fetchPosts(),
  });

  const dbSlugs = useMemo(() => new Set(posts.map((p) => p.slug)), [posts]);
  const notImported = useMemo(
    () => staticPosts.filter((p) => !dbSlugs.has(p.slug)),
    [dbSlugs],
  );

  const importOne = async (p: Post) => {
    await save({ data: staticToSavePayload(p) });
  };

  const importAll = async () => {
    setImporting(true);
    try {
      for (const p of notImported) {
        try {
          await importOne(p);
        } catch (e) {
          console.error("Import failed for", p.slug, e);
        }
      }
      toast.success(`Imported ${notImported.length} posts`);
      refetch();
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl italic" style={{ fontFamily: "var(--font-serif-display)" }}>
          Posts
        </h1>
        <div className="flex gap-2">
          {notImported.length > 0 && (
            <Button variant="outline" onClick={importAll} disabled={importing}>
              {importing ? "Importing…" : `Import ${notImported.length} existing blogs`}
            </Button>
          )}
          <Link to="/admin/new">
            <Button>New post</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <>
          {posts.length === 0 ? (
            <p className="text-muted-foreground mb-8">No posts in the database yet.</p>
          ) : (
            <ul className="divide-y divide-border border border-border rounded-md mb-10">
              {posts.map((p) => (
                <li key={p.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                          p.status === "published"
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{p.category || "—"}</span>
                    </div>
                    <div className="font-medium truncate">{p.title}</div>
                    <div className="text-xs text-muted-foreground truncate">/{p.slug}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`/preview/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline text-muted-foreground"
                    >
                      Preview
                    </a>
                    <Link to="/admin/edit/$id" params={{ id: p.id }}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    {p.status === "published" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          await setStatus({ data: { id: p.id, status: "draft" } });
                          refetch();
                          router.invalidate();
                        }}
                      >
                        Unpublish
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={async () => {
                          await setStatus({ data: { id: p.id, status: "published" } });
                          refetch();
                          router.invalidate();
                        }}
                      >
                        Publish
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
                        await del({ data: { id: p.id } });
                        refetch();
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {notImported.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl italic" style={{ fontFamily: "var(--font-serif-display)" }}>
                  Existing blogs (not yet editable)
                </h2>
                <span className="text-xs text-muted-foreground">
                  Import to edit, unpublish, or delete
                </span>
              </div>
              <ul className="divide-y divide-border border border-dashed border-border rounded-md">
                {notImported.map((p) => (
                  <li key={p.slug} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground mb-1">{p.category}</div>
                      <div className="font-medium truncate">{p.title}</div>
                      <div className="text-xs text-muted-foreground truncate">/{p.slug}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/post/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline text-muted-foreground"
                      >
                        View
                      </a>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await importOne(p);
                            toast.success("Imported — now editable");
                            refetch();
                          } catch (e) {
                            toast.error(e instanceof Error ? e.message : "Import failed");
                          }
                        }}
                      >
                        Import to edit
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
