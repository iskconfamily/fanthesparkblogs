## Goal
Give `/blog` the same elevated, sidebar-flanked feel as `/blog/$slug` — the post list sits inside the minimal reader shell with `PostTilesSidebar` on the left.

## Changes

### `src/routes/blog.index.tsx`
Drop `SiteLayout` and rebuild using the same shell as `blog.$slug.tsx`:
- Outer `<div className="post-minimal-page py-10 md:py-16">`
- Inner grid `mx-auto max-w-[1240px] px-5 md:px-8 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]`
- Left column (`order-2 lg:order-1`): `<PostTilesSidebar />`
- Right column (`order-1 lg:order-2`): the stacked `<PostPreview>` list (one post after another, dividers preserved by `PostPreview`'s own border).
- Keep the loader, `head()`, and `mergePosts` logic unchanged.

### Not touched
- `SiteHeader` still renders globally (it's mounted in `__root.tsx` or similar parent), so the page keeps the site chrome.
- `/blog/$slug`, `/blog2`, `/blog3` unchanged.

## Files
- `src/routes/blog.index.tsx` (rewrite component only)
