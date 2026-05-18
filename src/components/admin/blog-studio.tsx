import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  getPostById,
  extractFromUrl,
  uploadImage,
  studioGenerateBlog,
  studioReworkLayout,
  studioSaveMeta,
  setPostStatus,
} from "@/lib/admin.functions";
import { dbPostToPost } from "@/lib/blog-adapter";
import type { PostBlock } from "@/lib/post-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BlockChat } from "@/components/admin/block-chat";
import { BlockPreview } from "@/components/admin/block-preview";

type UploadedImage = { url: string; alt?: string };
type SourceTab = "paste" | "markdown" | "word" | "url";

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = r.result as string;
      resolve(s.split(",")[1] ?? "");
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function docxFileToMarkdown(file: File): Promise<string> {
  // mammoth's browser build runs in the user's browser — no Worker concern.
  const mammoth = await import("mammoth/mammoth.browser.js");
  const buf = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer: buf });
  // Reuse same HTML→markdown approach as server (links preserved).
  return htmlToMd(result.value);
}

function htmlToMd(html: string): string {
  let body = html
    .replace(/<a[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href: string, inner: string) => {
      const t = inner.replace(/<[^>]+>/g, "").trim();
      if (!t) return "";
      if (!/^https?:\/\//i.test(href) && !href.startsWith("mailto:")) return t;
      return `[${t}](${href})`;
    })
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, _l, t) => `\n\n## ${t.replace(/<[^>]+>/g, "").trim()}\n\n`)
    .replace(/<\/(p|div|li|tr)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return body;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

export function BlogStudio({ postId }: { postId: string }) {
  const router = useRouter();
  const fetchPost = useServerFn(getPostById);
  const extractUrl = useServerFn(extractFromUrl);
  const upload = useServerFn(uploadImage);
  const generate = useServerFn(studioGenerateBlog);
  const rework = useServerFn(studioReworkLayout);
  const saveMeta = useServerFn(studioSaveMeta);
  const setStatus = useServerFn(setPostStatus);

  const { data: post, refetch, isLoading } = useQuery({
    queryKey: ["studio-post", postId],
    queryFn: () => fetchPost({ data: { id: postId } }),
  });

  const [blocks, setBlocks] = useState<PostBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [tab, setTab] = useState<SourceTab>("paste");
  const [sourceText, setSourceText] = useState("");
  const [url, setUrl] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [referenceLayout, setReferenceLayout] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // Editable metadata
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [featured, setFeatured] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  useEffect(() => {
    if (!post) return;
    setBlocks(post.blocks ?? []);
    setTitle(post.title ?? "");
    setSlug(post.slug ?? "");
    setExcerpt(post.excerpt ?? "");
    setTags(post.tags ?? []);
    setFeatured(post.featured_image ?? "");
    setSeoTitle(post.seo_title ?? "");
    setSeoDesc(post.seo_description ?? "");
  }, [post]);

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!post) return <p className="text-muted-foreground">Post not found.</p>;

  const hasDraft = blocks.length > 0;

  const handleUploadFiles = async (files: FileList | null, target: "content" | "reference") => {
    if (!files || files.length === 0) return;
    setBusy(target === "reference" ? "Uploading reference…" : `Uploading ${files.length} image${files.length > 1 ? "s" : ""}…`);
    try {
      const uploaded: UploadedImage[] = [];
      for (const f of Array.from(files)) {
        if (f.size > 6_000_000) {
          toast.error(`${f.name} is too large (max 6MB)`);
          continue;
        }
        const base64 = await fileToBase64(f);
        const res = await upload({
          data: { filename: f.name, contentType: f.type || "image/jpeg", base64 },
        });
        uploaded.push({ url: res.url, alt: f.name.replace(/\.[a-z0-9]+$/i, "") });
        if (target === "reference") {
          setReferenceLayout(res.url);
          break;
        }
      }
      if (target === "content") setImages((prev) => [...prev, ...uploaded]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  };

  const loadFromTab = async (): Promise<string> => {
    if (tab === "paste") return sourceText;
    if (tab === "markdown") return sourceText;
    if (tab === "url") {
      setBusy("Fetching URL…");
      const res = await extractUrl({ data: { url } });
      return `${res.title ? `# ${res.title}\n\n` : ""}${res.text}`;
    }
    return sourceText; // word already loaded
  };

  const handleGenerate = async () => {
    setBusy("Composing layout…");
    try {
      const md = await loadFromTab();
      if (!md.trim()) {
        toast.error("Add some body text first.");
        setBusy(null);
        return;
      }
      const updated = await generate({
        data: {
          id: postId,
          markdown: md,
          sourceLabel: tab,
          images,
          referenceLayoutImageUrl: referenceLayout ?? undefined,
        },
      });
      toast.success("Draft composed");
      await refetch();
      setBlocks(updated.blocks ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setBusy(null);
    }
  };

  const handleRework = async (newImgs: UploadedImage[]) => {
    setBusy("Reworking layout…");
    try {
      const updated = await rework({
        data: { id: postId, newImages: newImgs },
      });
      toast.success("Layout reworked with new images");
      await refetch();
      setBlocks(updated.blocks ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Rework failed");
    } finally {
      setBusy(null);
    }
  };

  const handleSaveMeta = async () => {
    setBusy("Saving…");
    try {
      if (tags.length === 0) {
        toast.error("Add at least one tag before saving.");
        setBusy(null);
        return;
      }
      await saveMeta({
        data: {
          id: postId,
          title: title || "Untitled",
          slug: slug || slugify(title) || `post-${Date.now()}`,
          excerpt,
          category: post.category ?? "",
          tags,
          seo_title: seoTitle,
          seo_description: seoDesc,
          featured_image: featured,
        },
      });
      toast.success("Saved");
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(null);
    }
  };

  const handlePublish = async () => {
    if (tags.length === 0) {
      toast.error("Add at least one tag before publishing.");
      return;
    }
    await handleSaveMeta();
    await setStatus({ data: { id: postId, status: "published" } });
    toast.success("Published");
    router.invalidate();
    await refetch();
  };

  const addTag = (t: string) => {
    const v = t.trim().toLowerCase();
    if (!v) return;
    if (tags.includes(v)) return;
    if (tags.length >= 5) {
      toast.error("Keep it to 5 tags max.");
      return;
    }
    setTags([...tags, v]);
    setTagInput("");
  };

  const previewPost = dbPostToPost({ ...post, blocks });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl italic" style={{ fontFamily: "var(--font-serif-display)" }}>
            Blog Studio — {title || "Untitled"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Status: {post.status} · The AI arranges your text in the Quiet Quill style.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/edit/$id" params={{ id: postId }}>
            <Button variant="outline" size="sm">Classic editor</Button>
          </Link>
          <a href={`/preview/${slug || post.slug}`} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">Open preview</Button>
          </a>
          <Button size="sm" variant="outline" onClick={handleSaveMeta} disabled={!!busy}>
            Save draft
          </Button>
          <Button size="sm" onClick={handlePublish} disabled={!!busy}>
            {post.status === "published" ? "Re-publish" : "Publish"}
          </Button>
        </div>
      </div>

      {busy && <p className="text-xs text-primary italic">{busy}</p>}

      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr_400px] gap-6">
        {/* INPUT PANEL */}
        <div className="space-y-4">
          <div className="border border-border rounded-md p-4 bg-muted/30 space-y-3">
            <h2 className="text-sm uppercase tracking-wide text-muted-foreground">1. Source</h2>
            <div className="grid grid-cols-4 gap-1 text-xs">
              {(["paste", "markdown", "word", "url"] as SourceTab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`py-2 rounded border ${
                    tab === t ? "border-primary bg-primary/10" : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {t === "paste" ? "Paste" : t === "markdown" ? "Markdown" : t === "word" ? "Word" : "URL"}
                </button>
              ))}
            </div>
            {tab === "url" ? (
              <Input
                type="url"
                placeholder="https://…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            ) : tab === "word" ? (
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".docx"
                  className="text-sm"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setBusy("Reading Word doc…");
                    try {
                      const md = await docxFileToMarkdown(f);
                      setSourceText(md);
                      toast.success(`Loaded ${f.name} (${md.length.toLocaleString()} chars)`);
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Could not read .docx");
                    } finally {
                      setBusy(null);
                    }
                  }}
                />
                {sourceText && (
                  <p className="text-xs text-muted-foreground">
                    Loaded {sourceText.length.toLocaleString()} chars. Links preserved.
                  </p>
                )}
              </div>
            ) : (
              <Textarea
                rows={8}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={
                  tab === "markdown"
                    ? "Paste markdown. Links [text](https://…) preserved."
                    : "Paste blog text. Wording stays verbatim."
                }
              />
            )}
          </div>

          <div className="border border-border rounded-md p-4 bg-muted/30 space-y-3">
            <h2 className="text-sm uppercase tracking-wide text-muted-foreground">2. Images (optional)</h2>
            <input
              type="file"
              accept="image/*"
              multiple
              className="text-sm"
              onChange={(e) => handleUploadFiles(e.target.files, "content")}
            />
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img.url} alt="" className="w-full h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 bg-background/90 text-xs px-1.5 rounded hidden group-hover:block"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground">
              0, 1, or many. AI decides featured / inline / gallery placement.
            </p>
          </div>

          <div className="border border-border rounded-md p-4 bg-muted/30 space-y-3">
            <h2 className="text-sm uppercase tracking-wide text-muted-foreground">
              3. Layout reference (optional)
            </h2>
            <p className="text-[11px] text-muted-foreground">
              A screenshot showing how images could be arranged. Used as inspiration only — not embedded.
            </p>
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={(e) => handleUploadFiles(e.target.files, "reference")}
            />
            {referenceLayout && (
              <div className="relative">
                <img src={referenceLayout} alt="reference" className="w-full max-h-40 object-contain rounded border border-border" />
                <button
                  type="button"
                  onClick={() => setReferenceLayout(null)}
                  className="absolute top-1 right-1 bg-background/90 text-xs px-1.5 rounded"
                >
                  remove
                </button>
              </div>
            )}
          </div>

          <Button className="w-full" onClick={handleGenerate} disabled={!!busy}>
            {hasDraft ? "Regenerate from source" : "Compose blog with AI"}
          </Button>

          {hasDraft && (
            <div className="border border-border rounded-md p-4 bg-muted/30 space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-muted-foreground">Add more images & rework</h2>
              <input
                type="file"
                accept="image/*"
                multiple
                className="text-sm"
                onChange={async (e) => {
                  if (!e.target.files) return;
                  setBusy("Uploading…");
                  const uploaded: UploadedImage[] = [];
                  for (const f of Array.from(e.target.files)) {
                    if (f.size > 6_000_000) continue;
                    const b64 = await fileToBase64(f);
                    const res = await upload({
                      data: { filename: f.name, contentType: f.type || "image/jpeg", base64: b64 },
                    });
                    uploaded.push({ url: res.url, alt: f.name });
                  }
                  setBusy(null);
                  if (uploaded.length) await handleRework(uploaded);
                }}
              />
              <p className="text-[11px] text-muted-foreground">
                Upload → AI re-arranges the layout. Text stays verbatim.
              </p>
            </div>
          )}

          {hasDraft && (
            <div className="border border-border rounded-md p-4 space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-muted-foreground">Metadata</h2>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slug"
                className="font-mono text-xs"
              />
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="Excerpt"
              />
              <Input
                value={featured}
                onChange={(e) => setFeatured(e.target.value)}
                placeholder="Featured image URL"
              />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tags (1–5)</p>
                <div className="flex gap-1 flex-wrap mb-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded inline-flex items-center gap-1"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((x) => x !== t))}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="+ add tag (press Enter)"
                />
              </div>
              <Input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SEO title"
              />
              <Textarea
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                rows={2}
                placeholder="SEO description"
              />
            </div>
          )}
        </div>

        {/* PREVIEW */}
        <div>
          <BlockPreview
            post={previewPost}
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
          />
        </div>

        {/* CHAT */}
        <div className="xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)]">
          <BlockChat
            postId={postId}
            selectedBlockId={selectedBlockId}
            onBlocksUpdated={(b) => {
              setBlocks(b);
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
