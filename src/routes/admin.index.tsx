import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAllPosts, setPostStatus, deletePost } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: AdminList,
});

function AdminList() {
  const router = useRouter();
  const fetchPosts = useServerFn(listAllPosts);
  const setStatus = useServerFn(setPostStatus);
  const del = useServerFn(deletePost);
  const { data: posts = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => fetchPosts(),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl italic" style={{ fontFamily: "var(--font-serif-display)" }}>
          Posts
        </h1>
        <Link to="/admin/new">
          <Button>New post</Button>
        </Link>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Create your first one.</p>
      ) : (
        <ul className="divide-y divide-border border border-border rounded-md">
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
    </div>
  );
}
