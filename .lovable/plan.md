# Design each post with AI chat

## The core idea

Today, a post is one big text field (`content`) plus a single `image_layout` flag (`hero` / `side` / `none`). That's why every post ends up looking like a template — there's nowhere to store "image #3 goes small on the right after paragraph 5, image #4 goes full-width after the quote."

We replace that with a real **block document** per post — an ordered list of typed blocks (paragraph, heading, quote, image-hero, image-side-right, image-side-left, image-full, gallery, divider, callout). Each post stores its own arrangement. The same block document renders on the home page and on the post page, so what you design once shows up identically in both places.

An **AI chat** sits next to the post and edits this block document by calling tools (`insertBlock`, `moveBlock`, `setImageLayout`, `replaceText`, etc.). You talk to it in plain English ("put the four-questions image small on the right of paragraph 2", "add a full-width image after the quote"), and it edits the doc. A live preview updates as it edits. When you're happy, you click **Save & Preview**.

## What gets built

### 1. New block model (replaces single-layout flag)

A new column `blocks jsonb` on `blog_posts` holding an array like:

```text
[
  { id, type: "paragraph", text },
  { id, type: "heading",   level: 2, text },
  { id, type: "image",     src, alt, caption, layout: "hero" | "side-right" | "side-left" | "full" | "inline-small" },
  { id, type: "quote",     text, cite },
  { id, type: "gallery",   images: [{src,alt}, ...] },
  { id, type: "callout",   tone, text },
  { id, type: "divider" }
]
```

`image_layout` stays for backward-compat but is no longer the source of truth. A migration backfills `blocks` from existing `content` + `featured_image` + `image_layout` so nothing breaks.

### 2. One renderer used everywhere

`PostArticle` is rewritten to render `post.blocks` directly — no more "hero vs side vs none" branch. Side-image blocks float (left/right), full/hero blocks span the column, inline-small blocks sit at ~40% width inline. Because `PostArticle` is already used by both `post-preview.tsx` (home) and `post.$slug.tsx` (detail), every post looks identical in both places automatically.

### 3. AI chat designer (the new authoring surface)

A new admin route `/admin/design/$id` with two panes:

- **Left**: live preview of the post (the actual `PostArticle` component, same code as home/detail).
- **Right**: chat with the AI. Streaming via `createServerFn` async generator + `LOVABLE_API_KEY`.

The AI is given the current `blocks` array as context and a set of **tools** it can call:

- `insertBlock(afterId, block)`
- `updateBlock(id, patch)`  *(change text, layout, caption, alt, src)*
- `moveBlock(id, afterId)`
- `deleteBlock(id)`
- `generateImage(prompt) -> url`  *(uses existing `generateBlogImage`)*
- `setMeta({ title?, excerpt?, tags?, category? })`

Each tool call mutates the draft, the preview re-renders, and the chat narrates what changed. You can also click any block in the preview to "select" it, which scopes the next chat message to that block ("make this one full-width", "regenerate this image bigger").

### 4. Save & Preview flow

- The chat autosaves the working draft (debounced) into `blog_posts.blocks` with `status='draft'`.
- A **Save & Preview** button persists the latest state and navigates to `/preview/$slug` (already exists, admin-gated). Preview uses the exact same `PostArticle`, so it's a true WYSIWYG of home + post page.
- Publish stays a separate explicit action from the admin list.

### 5. Email rendering

The email builder switches to walking `blocks` (same model), so emailed posts match the on-site design (small side images stay small, hero images stay hero, etc.).

## Files touched

- **DB migration**: add `blocks jsonb not null default '[]'` to `blog_posts`; backfill from existing content.
- **`src/lib/blog-adapter.ts`**: add `blocks` to `Post` / `DbBlogPost`; converter prefers `blocks`, falls back to parsing `content` for legacy rows.
- **`src/components/post-article.tsx`**: rewrite to render `blocks` directly with per-block layout.
- **`src/components/article-body.tsx`**: become a thin block-renderer (paragraph/heading/quote/image/gallery/callout/divider).
- **`src/lib/admin.functions.ts`**: add `updatePostBlocks`, `chatDesignPost` (streaming serverFn with tools).
- **`src/lib/email.functions.ts`**: render from `blocks`.
- **New** `src/routes/admin.design.$id.tsx`: chat + live preview UI.
- **New** `src/components/admin/block-chat.tsx`, `src/components/admin/block-preview.tsx`.
- Admin list gets a "Design with AI" button alongside Edit.

## What stays the same

- Existing posts keep working (backfill).
- The current `PostEditor` form stays for manual text edits.
- The AI wizard for ingesting source text stays — its output now seeds the `blocks` array.
- Home page sidebar, header, related articles, newsletter, RLS, auth — untouched.

## Out of scope (for this round)

- Multi-column / magazine layouts beyond floating side images.
- Drag-and-drop block reordering in the preview (the chat handles ordering; drag-and-drop can come later if you want it).
- Versioning / undo history beyond the current draft.

If this matches what you have in mind, I'll implement it. If you'd rather start smaller (e.g. ship just the block model + chat editing without the live split-pane preview), say so and I'll trim the plan.
