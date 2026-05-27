## Goal
Restyle `/blog` index to match the old `/` homepage: full posts stacked one after the other using `PostPreview` inside `SiteLayout`.

## Changes

### `src/routes/blog.index.tsx`
Replace the current minimal divided-list with the old homepage layout:
- Wrap in `<SiteLayout>` (not bare `<main>`).
- For each post, render `<PostPreview post={post} />` — full article preview stacked vertically with border dividers.
- Drop the eyebrow + "The Blog" header (matches the old `/` which had no page header). If you'd prefer to keep a small header, say so; otherwise it goes.
- Keep `head()` meta and loader unchanged.
- The `Permalink` link inside `PostPreview` currently points to `/post/$slug`. Leaving that as-is (consistent with the prior `/` behavior). Let me know if it should point to `/blog/$slug` instead.

### Not touched
- `/blog/$slug` detail page (just redone in the last turn, stays as blog2 minimal style).
- `/`, `/home`, `/blog2`, `/blog3` are unchanged.

## Files
- `src/routes/blog.index.tsx` (rewrite component only)
