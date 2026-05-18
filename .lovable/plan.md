## Why you don't see it

The "Design with AI" button only renders for posts saved in the database. All your current blog posts are still static (in `src/content/posts.ts`), so they only show an **Import & edit** button. The new post flow also still routes to the old form editor.

## Changes

### 1. Show "Design with AI" on every post row
In `src/routes/admin.index.tsx`, for static-post rows add a **Design with AI** button that:
- Imports the post into the database (existing `importOne` flow)
- Auto-generates a `blocks` document from its existing content + featured image
- Navigates to `/admin/design/{id}`

### 2. Make "New post" open the chat designer directly
- `New post` button creates an empty draft (title "Untitled", empty blocks) via a new `createDraftPost` server fn
- Redirects straight to `/admin/design/{id}` — no form first
- The old `/admin/new` wizard stays accessible but is no longer the default

### 3. Make `/admin/design/{id}` the real workspace
Reachable from:
- New post button (auto-creates draft → design)
- Design with AI button on every row (static or DB)
- An "Open in AI designer" link from the existing edit form, for posts where someone prefers to start in the form

### 4. Top-of-admin callout
Add a short banner: "Design posts visually with AI — click **Design with AI** on any post, or **New post** to start fresh." So the entry point is obvious.

### 5. Small fixes spotted in passing
- The hydration error on `/` and `/post/...` (newsletter form button vs LastPass extension injection) — wrap the subscribe `<form>` content in a client-only render guard so the server output matches the client.

## Out of scope
- Removing the old form editor (kept as a fallback)
- Migrating all static posts automatically — still one-click per post, but now in the same button as design
- Chat history persistence between sessions

## Files touched
- `src/routes/admin.index.tsx` — add Design with AI to static rows, change New post behavior, add banner
- `src/lib/admin.functions.ts` — add `createDraftPost` server fn
- `src/components/admin/post-editor.tsx` — add "Open in AI designer" link
- `src/components/site-footer.tsx` (or wherever the subscribe form lives) — fix hydration
