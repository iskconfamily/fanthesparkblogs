import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { savePost, generateDraft, uploadImage } from "@/lib/admin.functions";
import type { DbBlogPost } from "@/lib/blog-adapter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

export function PostEditor({ existing }: { existing?: DbBlogPost }) {
  const router = useRouter();
  const save = useServerFn(savePost);
  const aiDraft = useServerFn(generateDraft);
  const upload = useServerFn(uploadImage);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [featuredImage, setFeaturedImage] = useState(existing?.featured_image ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [author, setAuthor] = useState(existing?.author ?? "Vaisesika Dasa");
  const [status, setStatus] = useState<"draft" | "published">(existing?.status ?? "draft");
  const [aiPrompt, setAiPrompt] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const id = existing?.id;

  const persist = async (nextStatus: "draft" | "published") => {
    setBusy(nextStatus === "published" ? "Publishing…" : "Saving…");
    setError("");
    try {
      const finalSlug = slug || slugify(title);
      const saved = await save({
        data: {
          id,
          title,
          slug: finalSlug,
          excerpt,
          content,
          featured_image: featuredImage || null,
          category,
          author,
          status: nextStatus,
        },
      });
      setStatus(saved.status);
      if (!id) router.navigate({ to: "/admin/edit/$id", params: { id: saved.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(null);
    }
  };

  const runAi = async () => {
    if (!aiPrompt.trim()) return;
    setBusy("Generating draft…");
    setError("");
    try {
      const draft = await aiDraft({ data: { prompt: aiPrompt } });
      if (!title) setTitle(draft.title);
      if (!slug) setSlug(slugify(draft.title));
      if (!excerpt) setExcerpt(draft.excerpt);
      if (!category) setCategory(draft.category);
      setContent((c) => (c ? c + "\n\n" + draft.content : draft.content));
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI generation failed");
    } finally {
      setBusy(null);
    }
  };

  const handleFile = async (file: File) => {
    if (file.size > 6_000_000) {
      setError("Image too large (max 6MB).");
      return;
    }
    setBusy("Uploading…");
    setError("");
    try {
      const buf = await file.arrayBuffer();
      let bin = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      const base64 = btoa(bin);
      const { url } = await upload({
        data: { filename: file.name, contentType: file.type || "image/jpeg", base64 },
      });
      setFeaturedImage(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  };

  const previewSlug = slug || slugify(title);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-4">
        <h1 className="text-2xl italic" style={{ fontFamily: "var(--font-serif-display)" }}>
          {existing ? "Edit post" : "New post"}
        </h1>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted-foreground">Title</label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!existing && !slug) setSlug(slugify(e.target.value));
            }}
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted-foreground">Slug</label>
          <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted-foreground">Excerpt</label>
          <Textarea value={excerpt} rows={3} onChange={(e) => setExcerpt(e.target.value)} />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted-foreground">
            Content (paragraphs separated by blank lines; "## " for headings; "&gt; " for quotes)
          </label>
          <Textarea
            value={content}
            rows={20}
            onChange={(e) => setContent(e.target.value)}
            className="font-mono text-sm"
          />
        </div>
      </div>

      <aside className="space-y-6">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {busy && <p className="text-sm text-muted-foreground">{busy}</p>}

        <div className="space-y-2">
          <Button onClick={() => persist("draft")} variant="outline" className="w-full" disabled={!!busy}>
            Save draft
          </Button>
          <Button onClick={() => persist("published")} className="w-full" disabled={!!busy}>
            {status === "published" ? "Update published" : "Publish"}
          </Button>
          {previewSlug && (
            <a
              href={`/preview/${previewSlug}`}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-sm underline text-muted-foreground pt-1"
            >
              Open preview ↗
            </a>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <label className="text-xs uppercase tracking-wide text-muted-foreground">Category</label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted-foreground">Author</label>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted-foreground">Featured image URL</label>
          <Input value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="https://…" />
          <input
            type="file"
            accept="image/*"
            className="mt-2 text-sm"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {featuredImage && (
            <img src={featuredImage} alt="" className="mt-2 w-full rounded border border-border" />
          )}
        </div>

        <div className="border-t border-border pt-4">
          <label className="text-xs uppercase tracking-wide text-muted-foreground">
            Generate draft with AI
          </label>
          <Textarea
            value={aiPrompt}
            rows={4}
            placeholder="Topic, notes, or an outline…"
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <Button onClick={runAi} variant="outline" className="w-full mt-2" disabled={!!busy}>
            Generate
          </Button>
        </div>
      </aside>
    </div>
  );
}
