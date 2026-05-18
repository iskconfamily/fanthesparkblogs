## Goal

Turn the current admin AI flow into a true **Blog Studio**: admin gives raw material (text, Markdown, Word doc, URL, optional images, optional layout-reference image), AI arranges it beautifully inside the existing Quiet Quill style, admin keeps refining via chat and additional uploads. Body wording and links are preserved verbatim.

## What changes

### 1. Richer block model (`src/lib/post-blocks.ts`)

Add new block types so the AI has real layout vocabulary:

- `pull-quote` — large display quote inside the column
- `image-text` — image + paragraph(s) side-by-side
- `gallery` — 2–4 image grid
- `image-full` (already covered via `layout: "full"`, but expose as a clear option)
- `newsletter-cta`

Existing types stay: `paragraph`, `heading`, `quote`, `image`, `divider`, `callout`.

All rendered with the **existing Quiet Quill typography & spacing** — new blocks reuse current CSS tokens (`font-serif-display`, muted accents, generous spacing). No new visual style; just new arrangements.

### 2. Admin Blog Studio UI (`src/components/admin/blog-studio.tsx` — new)

Replaces the current "AI Wizard → Editor" two-step on `/admin/design/$id`.

Single page, three panels:

```text
┌──────────────────────────┬─────────────────────────────┐
│ INPUT PANEL              │ LIVE PREVIEW (Quiet Quill)  │
│  · Source (tabs):        │  Renders the block document │
│      Paste / MD / Word   │  exactly as it will appear  │
│      / URL               │  on the published post page │
│  · Images (drop zone,    │                             │
│      multi-upload)       │                             │
│  · Layout reference      │                             │
│      image (single,      │                             │
│      marked "inspiration │                             │
│      only — not embedded")│                            │
│  · "Generate blog"       │                             │
│                          │                             │
│ AFTER GENERATION:        │                             │
│  · Add more images →     │                             │
│      "Rework layout"     │                             │
│  · Tag editor            │                             │
│  · Title / excerpt / SEO │                             │
│  · Publish / Save draft  │                             │
├──────────────────────────┤                             │
│ CHAT WITH AI             │                             │
│  (existing block-chat,   │                             │
│  upgraded — see §5)      │                             │
└──────────────────────────┴─────────────────────────────┘
```

### 3. Multi-format ingest (server fns in `src/lib/admin.functions.ts`)

New / upgraded server functions:

- `extractFromUrl` — already exists; keep but **preserve `<a href>` links** by converting to Markdown `[text](url)` before stripping HTML (currently links are lost).
- `extractFromMarkdown` — new. Accepts raw `.md` text; already preserves links.
- `extractFromDocx` — new. Accepts base64 `.docx`; uses `mammoth` (`bun add mammoth`) to convert to Markdown, which preserves hyperlinks and basic structure.
- All extractors return `{ title?, markdown, sourceLabel }`.

### 4. AI layout designer (`generateBlogFromSource` — rewritten)

Inputs:

- `markdown` (verbatim body)
- `images: { url, alt? }[]` (already-uploaded user images)
- `referenceLayoutImageUrl?` (passed to model as inspiration only; vision model sees it, does NOT embed it)

The model emits a **block document** directly (not freeform markdown), via tool calling. New system prompt:

> You are a layout arranger for The Quiet Quill — a contemplative literary blog with established typography. Preserve every word of the body verbatim, including all hyperlinks and YouTube URLs. Decide where each provided image goes (featured / inline / image-text / gallery / full-width). If the user provided a layout-reference image, use it ONLY as inspiration for arrangement — never include that image in the output. If no images were provided, propose 0–3 `image_prompts` if (and only if) the text would benefit. Suggest 1–3 tags. Output: blocks[], tags[], title, excerpt, seo_title, seo_description, featured_image_index (or null), suggested_image_prompts[].

Link preservation:

- Body text is split into paragraph blocks, each carrying inline markdown links. Renderer renders `[text](url)` as anchor tags (already partly handled; we'll ensure it covers `paragraph`, `quote`, `pull-quote`, `callout`, `image-text` blocks).
- YouTube links: keep as-is in text (clickable). No auto-embed unless admin asks in chat.

### 5. Post-draft refinement

- **Upload more images later** → button under preview "Add images & rework". Calls `reworkLayoutWithNewImages(postId, newImageUrls[])` which re-runs the layout step using existing blocks + new images, only re-arranging image placements (paragraph text untouched).
- **Chat designer** (existing `chatDesignPost`) — extend system prompt + `edit_post` tool with new block types (`pull-quote`, `image-text`, `gallery`, `newsletter-cta`) and ops: `replaceImage`, `removeImage`, `regenerateImagePrompt`.
- Quick action buttons above chat: "Make calmer", "Make more minimal", "Regenerate featured image", "Replace featured image" (file picker).

### 6. Tag UX

- AI returns 1–3 suggested tags (max 5).
- Editor shows tag chips with X to remove, plus free-text "+ add tag".
- Enforced minimum: 1 tag required to publish (toast otherwise).

### 7. Renderer updates (`src/components/article-body.tsx`, post-article, block-preview)

- Render `pull-quote` (display serif, large, muted left rule)
- Render `image-text` (CSS grid, image left/right by `layout` field)
- Render `gallery` (responsive 2-col / 3-col grid)
- Render `newsletter-cta` (reuse `<InlineNewsletter />`)
- Inline link rendering in all text blocks via tiny markdown-to-JSX (links + bold/italic only — no full markdown parser; avoids `dangerouslySetInnerHTML`).

### 8. Routes

- `/admin/design/$id` → mounts new `<BlogStudio postId={id} />`
- Old `AiWizard` component & `/admin/new` editor: keep as a fallback "Classic editor" linked from the studio for safety; not removed.

## Technical notes

- **`mammoth`** runs server-side only inside the `extractFromDocx` server function — Worker-compatible (pure JS).
- **No new tables**: everything fits in existing `blog_posts.blocks` JSONB + `tags` array. We bump the block Zod schema in `updatePostBlocks` to allow new types.
- **Link safety**: links rendered via React `<a href>` — never `dangerouslySetInnerHTML`. URLs validated with `new URL()`; non-http(s) dropped.
- **Image upload**: reuse existing `uploadImage` server fn (base64). Multi-upload = loop client-side with a progress list.
- **Reference layout image**: uploaded to storage, URL passed to `generateBlogFromSource`, then **deleted from storage after generation** (it's only inspiration, not an asset).
- **Vision**: pass `referenceLayoutImageUrl` + uploaded image URLs as `image_url` content parts to `google/gemini-2.5-flash` so the model can actually see them when arranging.

## Files

Create:
- `src/components/admin/blog-studio.tsx`
- `src/components/admin/source-input.tsx`
- `src/components/admin/image-uploader.tsx`
- `src/components/admin/tag-editor.tsx`
- `src/lib/markdown-inline.tsx` (tiny safe link/bold/italic renderer)

Edit:
- `src/lib/post-blocks.ts` (new block types)
- `src/lib/admin.functions.ts` (extractors, rewritten generator, rework fn, expanded chat tool, expanded block schema)
- `src/components/article-body.tsx`, `src/components/admin/block-preview.tsx`, `src/components/post-article.tsx` (render new blocks + inline links)
- `src/components/admin/block-chat.tsx` (quick action buttons)
- `src/routes/admin.design.$id.tsx` (mount studio)
- `src/routes/admin.edit.$id.tsx` (link to studio)

Add dep: `mammoth`.

## Out of scope

- Real-time collaborative editing
- Image cropping / focal-point editor
- Auto-embedding YouTube as video (only links preserved)
- Drag-and-drop block reordering (chat covers this; can add later)

Ship in one pass, then we iterate.