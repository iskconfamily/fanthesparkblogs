import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { savePost, uploadImage, generateBlogImage } from "@/lib/admin.functions";
import { getBlogEmailHtml, sendMailchimpCampaignTest, sendMailchimpCampaignLive } from "@/lib/email.functions";
import type { DbBlogPost, ImagePrompt } from "@/lib/blog-adapter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AiWizard, type AiDraft } from "./ai-wizard";

const SITE_URL_PREVIEW = "https://fanthesparkblogs.lovable.app";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

export function PostEditor({ existing }: { existing?: DbBlogPost }) {
  const router = useRouter();
  const save = useServerFn(savePost);
  const upload = useServerFn(uploadImage);
  const genImage = useServerFn(generateBlogImage);
  const fetchBlogHtml = useServerFn(getBlogEmailHtml);
  const sendMcTest = useServerFn(sendMailchimpCampaignTest);
  const sendMcLive = useServerFn(sendMailchimpCampaignLive);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [featuredImage, setFeaturedImage] = useState(existing?.featured_image ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [author, setAuthor] = useState(existing?.author ?? "Vaisesika Dasa");
  const [status, setStatus] = useState<"draft" | "published">(existing?.status ?? "draft");
  const [tagsText, setTagsText] = useState((existing?.tags ?? []).join(", "));
  const [seoTitle, setSeoTitle] = useState(existing?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(existing?.seo_description ?? "");
  const [imagePrompts, setImagePrompts] = useState<ImagePrompt[]>(existing?.image_prompts ?? []);
  const [imageLayout, setImageLayout] = useState<"hero" | "side" | "none">(
    (existing?.image_layout as "hero" | "side" | "none" | undefined) ?? "hero",
  );

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [announcementSentAt, setAnnouncementSentAt] = useState<string | null>(
    existing?.announcement_sent_at ?? null,
  );
  const [blogHtml, setBlogHtml] = useState<string>("");
  const [blogHtmlError, setBlogHtmlError] = useState<string>("");
  const [mcTestEmail, setMcTestEmail] = useState("");
  const [mcMsg, setMcMsg] = useState("");


  const id = existing?.id;

  useEffect(() => {
    if (!id) {
      setBlogHtml("");
      setBlogHtmlError("");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const r = await fetchBlogHtml({ data: { postId: id } });
        if (cancelled) return;
        setBlogHtml(r.html);
        setBlogHtmlError("");
      } catch (e) {
        if (!cancelled) {
          setBlogHtml("");
          setBlogHtmlError(e instanceof Error ? e.message : "Failed to build blog_html");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, fetchBlogHtml, content, existing?.updated_at]);


  const parsedTags = tagsText
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

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
          tags: parsedTags,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null,
          image_prompts: imagePrompts,
          image_layout: imageLayout,
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

  const applyDraft = (draft: AiDraft) => {
    setTitle(draft.title);
    setSlug(slugify(draft.title));
    setExcerpt(draft.excerpt);
    setContent(draft.content);
    setCategory(draft.category);
    setTagsText(draft.tags.join(", "));
    setSeoTitle(draft.seo_title);
    setSeoDescription(draft.seo_description);
    setImagePrompts(draft.image_prompts);
    setStatus("draft");
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

  const generatePromptImage = async (index: number) => {
    const p = imagePrompts[index];
    if (!p) return;
    setBusy(`Generating image ${index + 1}…`);
    setError("");
    try {
      const { url } = await genImage({ data: { prompt: p.prompt } });
      setImagePrompts((prev) => prev.map((ip, i) => (i === index ? { ...ip, url } : ip)));
      // Replace inline placeholder pending:<index> with the actual URL in content
      setContent((c) =>
        c.replace(
          new RegExp(`!\\[([^\\]]*)\\]\\(pending:${index}\\)`, "g"),
          `![${p.alt ?? ""}](${url})`,
        ),
      );
      // If this is the first prompt and no featured image, use it
      if (index === 0 && !featuredImage) setFeaturedImage(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image generation failed");
    } finally {
      setBusy(null);
    }
  };

  const useAsFeatured = (index: number) => {
    const url = imagePrompts[index]?.url;
    if (url) setFeaturedImage(url);
  };

  const sendMailchimpTestEmail = async () => {
    if (!id) {
      setMcMsg("Save the post first.");
      return;
    }
    if (!mcTestEmail.trim()) {
      setMcMsg("Enter a test email address.");
      return;
    }
    if (!blogHtml || blogHtml.trim().length === 0) {
      setMcMsg("blog_html is empty — add content to the post before sending.");
      return;
    }
    setBusy("Sending Mailchimp test…");
    setMcMsg("");
    try {
      const r = await sendMcTest({
        data: { postId: id, testEmail: mcTestEmail.trim() },
      });
      setMcMsg(`✅ Test sent to ${r.testEmail} (campaign ${r.campaignId}).`);
    } catch (e) {
      setMcMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  const sendMailchimpToAudience = async () => {
    if (!id) {
      setMcMsg("Save the post first.");
      return;
    }
    if (!blogHtml || blogHtml.trim().length === 0) {
      setMcMsg("blog_html is empty — add content to the post before sending.");
      return;
    }
    const ok = window.confirm(
      "Send this blog post as a live campaign to ALL subscribers in your Mailchimp audience? This cannot be undone.",
    );
    if (!ok) return;
    setBusy("Sending live Mailchimp campaign…");
    setMcMsg("");
    try {
      const r = await sendMcLive({ data: { postId: id, confirm: true } });
      setMcMsg(`🚀 Live campaign sent (id ${r.campaignId}) to audience ${r.audienceId}.`);
      setAnnouncementSentAt(new Date().toISOString());
    } catch (e) {
      setMcMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };




  const previewSlug = slug || slugify(title);

  return (
    <div className="space-y-6">
      <AiWizard onApply={applyDraft} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
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
              Content — paragraphs separated by blank lines · "## " headings · "&gt; " quotes ·
              ![alt](url) for images
            </label>
            <Textarea
              value={content}
              rows={22}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <h3 className="text-sm uppercase tracking-wide text-muted-foreground">SEO</h3>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">SEO title</label>
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70} />
              <p className="text-[11px] text-muted-foreground mt-1">{seoTitle.length}/60 ideal</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">SEO description</label>
              <Textarea
                value={seoDescription}
                rows={2}
                onChange={(e) => setSeoDescription(e.target.value)}
                maxLength={300}
              />
              <p className="text-[11px] text-muted-foreground mt-1">{seoDescription.length}/155 ideal</p>
            </div>
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
            <label className="text-xs uppercase tracking-wide text-muted-foreground">
              Tags (comma separated)
            </label>
            <Input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="bhakti, wisdom, meditation"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Author</label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">
              Featured image URL
            </label>
            <Input
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://…"
            />
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

          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">
              Image layout
            </label>
            <select
              value={imageLayout}
              onChange={(e) => setImageLayout(e.target.value as "hero" | "side" | "none")}
              className="mt-1 w-full border border-border rounded bg-background px-2 py-1.5 text-sm"
            >
              <option value="hero">Hero — large image after first paragraph</option>
              <option value="side">Side — small image floated right of text</option>
              <option value="none">None — no featured image in body</option>
            </select>
            <p className="text-[11px] text-muted-foreground mt-1">
              Applies to both the home page card and the post page.
            </p>
          </div>

          {imagePrompts.length > 0 && (
            <div className="border-t border-border pt-4 space-y-3">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Image prompts ({imagePrompts.length})
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Generate AI images, or copy the prompt into Canva / Midjourney.
              </p>
              {imagePrompts.map((p, i) => (
                <div key={i} className="border border-border rounded p-2 space-y-2 bg-background">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {i === 0 ? "Featured" : `Inline #${i}`}
                  </div>
                  <Textarea
                    rows={2}
                    value={p.prompt}
                    onChange={(e) =>
                      setImagePrompts((prev) =>
                        prev.map((ip, idx) => (idx === i ? { ...ip, prompt: e.target.value } : ip)),
                      )
                    }
                    className="text-xs"
                  />
                  {p.url && <img src={p.url} alt="" className="w-full rounded border border-border" />}
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generatePromptImage(i)}
                      disabled={!!busy}
                    >
                      {p.url ? "Regenerate" : "Generate"}
                    </Button>
                    {p.url && i !== 0 && (
                      <Button size="sm" variant="outline" onClick={() => useAsFeatured(i)}>
                        Use as featured
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard?.writeText(p.prompt)}
                    >
                      Copy prompt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="border-t border-border pt-4 space-y-3">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
              Email announcement
            </h3>
            {!id && (
              <p className="text-[11px] text-muted-foreground">
                Save the post first to enable email sending.
              </p>
            )}
            {announcementSentAt && (
              <p className="text-[11px] text-muted-foreground">
                Last campaign sent {new Date(announcementSentAt).toLocaleString()}.
              </p>
            )}

            <div className="space-y-1 border border-border rounded p-2 bg-background">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Mailchimp content payload
              </p>
              <pre className="text-[10px] leading-snug whitespace-pre-wrap break-all text-muted-foreground font-mono">
{`subject_line  = ${title}
preview_text  = ${title}
from_name     = ${author || "Fan The Spark"}
reply_to      = newsletter@fanthespark.com
template_id   = 10000067
audience_id   = a97040f5e0
blog_html     = ${blogHtml.length} chars`}
              </pre>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground pt-1">
                blog_html preview (first 300 chars)
              </p>
              <pre className="text-[10px] leading-snug whitespace-pre-wrap break-all text-muted-foreground font-mono max-h-32 overflow-auto">
{blogHtml ? blogHtml.slice(0, 300) + (blogHtml.length > 300 ? "…" : "") : "(empty — save the post and add content)"}
              </pre>
              {blogHtmlError && (
                <p className="text-[11px] text-destructive break-words">{blogHtmlError}</p>
              )}
              <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">
                The rendered post HTML is inserted into the template section named <code>blog_html</code>.
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-border space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Mailchimp Campaign
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Uses template <code>#10000067</code> (audience <code>a97040f5e0</code>). The post's
                rendered HTML is injected into the <code>mc:edit="blog_html"</code> region.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Send test email
                </label>
                <Input
                  type="email"
                  value={mcTestEmail}
                  onChange={(e) => setMcTestEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={sendMailchimpTestEmail}
                  disabled={!!busy || !id || !mcTestEmail.trim() || !blogHtml}
                >
                  Send test email
                </Button>
              </div>

              <div className="pt-2 border-t border-border space-y-1.5">
                <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Live broadcast
                </label>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={sendMailchimpToAudience}
                  disabled={!!busy || !id || !blogHtml}
                >
                  🚀 Send to all subscribers
                </Button>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Triggers a live Mailchimp campaign to your entire audience. You'll be asked to confirm.
                </p>
              </div>

              {mcMsg && (
                <p className="text-[11px] text-muted-foreground break-words">{mcMsg}</p>
              )}
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
