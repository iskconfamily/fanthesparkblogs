import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { listAllPosts, setPostStatus, deletePost, savePost, createDraftPost } from "@/lib/admin.functions";
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

function absUrl(src: string): string {
  if (/^https?:\/\//.test(src)) return src;
  if (typeof window !== "undefined") return new URL(src, window.location.origin).toString();
  return src;
}

function staticToSavePayload(p: Post) {
  const body = p.body.map((b) =>
    b.type === "figure" ? { ...b, src: absUrl(b.src) } : b,
  );
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? "",
    content: blocksToMarkdown(body),
    featured_image: absUrl(p.featuredImage.src),
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
  const createDraft = useServerFn(createDraftPost);
  const [importing, setImporting] = useState(false);
  const [creating, setCreating] = useState(false);

  const { data: posts = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => fetchPosts(),
  });

  const dbPostsBySlug = useMemo(() => new Map(posts.map((p) => [p.slug, p])), [posts]);
  const notImported = useMemo(
    () => staticPosts.filter((p) => !dbPostsBySlug.has(p.slug)),
    [dbPostsBySlug],
  );
  const allPosts = useMemo(() => {
    const seen = new Set<string>();

    const merged = staticPosts.map((p) => {
      const dbPost = dbPostsBySlug.get(p.slug);
      seen.add(p.slug);

      if (dbPost) {
        return {
          kind: "db" as const,
          slug: dbPost.slug,
          sortDate: dbPost.updated_at ?? dbPost.created_at ?? null,
          post: dbPost,
        };
      }

      return {
        kind: "static" as const,
        slug: p.slug,
        sortDate: p.date,
        post: p,
      };
    });

    for (const p of posts) {
      if (!seen.has(p.slug)) {
        merged.push({
          kind: "db" as const,
          slug: p.slug,
          sortDate: p.updated_at ?? p.created_at ?? null,
          post: p,
        });
      }
    }

    return merged.sort((a, b) => {
      const aTime = a.sortDate ? new Date(a.sortDate).getTime() : 0;
      const bTime = b.sortDate ? new Date(b.sortDate).getTime() : 0;
      return bTime - aTime;
    });
  }, [dbPostsBySlug, posts]);

  const importOne = async (p: Post) => save({ data: staticToSavePayload(p) });

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
          <Button
            disabled={creating}
            onClick={async () => {
              setCreating(true);
              try {
                const draft = await createDraft();
                toast.success("Draft created — design it with AI");
                await router.navigate({ to: "/admin/design/$id", params: { id: draft.id } });
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Could not create draft");
              } finally {
                setCreating(false);
              }
            }}
          >
            {creating ? "Creating…" : "New post (AI designer)"}
          </Button>
        </div>
      </div>

      <div className="mb-6 p-4 border border-border rounded-md bg-muted/30 text-sm">
        <strong>Design posts visually with AI.</strong> Click{" "}
        <em>New post (AI designer)</em> to start fresh, or <em>Design with AI</em> on
        any post below to lay out images and text exactly where you want.

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <>
          {allPosts.length === 0 ? (
            <p className="text-muted-foreground mb-8">No posts found yet.</p>
          ) : (
            <ul className="divide-y divide-border border border-border rounded-md mb-10">
              {allPosts.map((entry) => {
                if (entry.kind === "db") {
                  const p = entry.post;
                  return (
                    <li key={p.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                        <a
                          href={`/preview/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm underline text-muted-foreground"
                        >
                          Preview
                        </a>
                        <Link to="/admin/design/$id" params={{ id: p.id }}>
                          <Button size="sm">Design with AI</Button>
                        </Link>
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
                  );
                }

                const p = entry.post;

                return (
                  <li key={p.slug} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          site post
                        </span>
                        <span className="text-xs text-muted-foreground">{p.category || "—"}</span>
                      </div>
                      <div className="font-medium truncate">{p.title}</div>
                      <div className="text-xs text-muted-foreground truncate">/{p.slug}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
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
                            const imported = await importOne(p);
                            toast.success("Imported — now editable");
                            refetch();
                            await router.navigate({
                              to: "/admin/edit/$id",
                              params: { id: imported.id },
                            });
                          } catch (e) {
                            toast.error(e instanceof Error ? e.message : "Import failed");
                          }
                        }}
                      >
                        Import & edit
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
