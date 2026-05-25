# Experimental Blog Layout Routes

Add three parallel sets of blog routes for layout experimentation. All routes read from the existing data source (`getPublishedDbPosts` / `getPublishedDbPostBySlug` in `src/lib/blog.functions.ts`, merged with static posts via `getAllPosts`). No data duplication, no menu changes, no changes to `/`.

## New route files

Each pair mirrors the existing `wisdom.blog.tsx` + `wisdom.blog.$slug.tsx` pattern (loader → merge with static posts → render).

1. `src/routes/blog.tsx` — listing (Layout v1)
2. `src/routes/blog.$slug.tsx` — post detail (Layout v1)
3. `src/routes/blog2.tsx` — listing (Layout v2)
4. `src/routes/blog2.$slug.tsx` — post detail (Layout v2)
5. `src/routes/blog3.tsx` — listing (Layout v3)
6. `src/routes/blog3.$slug.tsx` — post detail (Layout v3)

All slug routes fall back to `getPostBySlug` (static posts) if the DB lookup returns null, matching current behavior.

## Layout directions (visual only — same data, same blocks)

- **v1 `/blog`** — Editorial magazine grid. Large featured post on top, 2-column card grid below. Serif display titles, generous whitespace. Detail page: wide single-column reading view with hero image.
- **v2 `/blog2`** — Minimal list. No images in the listing — just title, date, excerpt, and a thin divider per post (think Craig Mod / Substack reader). Detail page: narrow centered column, smaller hero, focus on typography.
- **v3 `/blog3`** — Bento / asymmetric grid. Mixed tile sizes with featured image overlays and category chips. Detail page: split-screen with sticky meta sidebar (author, date, tags) and scrolling content.

Each layout reuses the existing `ArticleBody` / `PostBlock` renderer for post bodies so block content stays consistent — only the page chrome, listing cards, and detail wrapper differ.

## Shared building blocks

- Reuse `SiteLayout` (or wrap in a minimal local layout where v2/v3 want less chrome).
- Reuse `mergePosts` logic from `wisdom.blog.tsx` — extract into a small helper `src/lib/merge-posts.ts` to avoid copy-paste across 3 listings.
- Reuse `PostArticle` for v1 detail; v2 and v3 details get their own thin wrapper components in `src/components/blog-layouts/` (e.g. `PostMinimal.tsx`, `PostSplit.tsx`) that consume `post.blocks` + `ArticleBody`.

## Out of scope (per request)

- No nav/menu changes.
- No redirects, canonicals, or SEO indexing controls.
- `/` page untouched.
- Existing `/post/:slug`, `/wisdom/blog`, `/wisdom/blog/:slug` untouched.

## Confirm before I build

Want me to proceed with all three layout variants (v1 editorial, v2 minimal, v3 bento) as described, or skip v3 for now?
