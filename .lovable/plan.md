## Goal

1. The `/blog` index and `/blog/$slug` detail pages should look like the `/blog2` versions (minimal reader layout with sidebar of post tiles).
2. The site's default URL `/` should serve the current `/home` page.

## Changes

### 1. `src/routes/blog.$slug.tsx` — adopt blog2 detail style
Replace the current `SiteLayout` + `PostArticle` + `RelatedArticles` component body with the same shell used in `blog2.$slug.tsx`:
- Outer `div.post-minimal-page py-10 md:py-16`
- Inner grid `max-w-[1240px] ... lg:grid-cols-[240px_minmax(0,1fr)]`
- Left: `<PostTilesSidebar />`
- Right: `<PostMinimal post={post} bare />`
- Drop `RelatedArticles` and the related posts query in the loader (blog2 doesn't show them).
- Keep `notFoundComponent` / `errorComponent` but restyle them to match blog2's minimal `<main>` wrapper, with the "back" link still pointing to `/blog`.
- Keep the route path `/blog/$slug` and the existing `head()` meta unchanged.

### 2. `src/routes/blog.index.tsx` — adopt blog2 listing style
Replace the current editorial featured-card + grid layout with the blog2 listing style:
- Plain `<main className="min-h-screen bg-background text-foreground">` wrapper (no `SiteLayout`, matching blog2).
- Header eyebrow + serif "Essays" title.
- Vertical `divide-y` list of posts linking to `/blog/$slug` (not `/blog2/$slug`) — date, title, excerpt.
- Drop the `Card` helper, the featured post split, and the image grid.
- Keep route path `/blog/`, loader, and head meta unchanged (title can stay or be updated to "Blog — Fan The Spark").

### 3. Default home → `/home`
The `/home` route already exists with the full landing page. Update `src/routes/index.tsx` so visiting `/` lands on the same content as `/home`. Two reasonable options:

- **Option A (recommended): redirect.** Change `index.tsx` to a route that `throw redirect({ to: "/home" })` from `beforeLoad`. Simple, keeps a single source of truth, but the URL becomes `/home`.
- **Option B: render home at `/`.** Re-export `HomePage` (and its loader) from `home.tsx` so `/` renders the full home page while `/home` keeps working. URL stays `/`.

Going with **Option A** unless you prefer the URL to remain `/`.

### Not in scope
- `/blog2`, `/blog3`, and `wisdom/blog/*` routes are left untouched.
- Header navigation links elsewhere in the site are not retargeted; only the routes above change.
- The hydration warning on `/blog` originates from the LastPass browser extension injecting nodes into the newsletter form — not a code bug, no change.

## Files touched
- `src/routes/blog.$slug.tsx` (rewrite component + loader)
- `src/routes/blog.index.tsx` (rewrite component)
- `src/routes/index.tsx` (replace with redirect to `/home`)
