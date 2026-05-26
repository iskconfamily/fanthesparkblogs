## Add tile sidebar to blog2 post pages

Right now `/blog/$slug` uses `SiteLayout`, which renders the full `Sidebar` (article tiles, books, newsletter, recent, tags) on the left. `/blog2/$slug` uses `PostMinimal` standalone — centered card, no sidebar.

The user wants just the **article tiles** (the top section of `Sidebar` — one image + italic title per row, randomized on mount) added to the left of blog2 posts. Everything else about blog2 stays the same: the cream card, typography, byline with portrait, back link, no header/footer chrome, no books/newsletter/recent/tags.

### Changes

1. **New component `src/components/blog-layouts/PostTilesSidebar.tsx`**
   - Extract just the "Article tiles" `<section>` from `src/components/sidebar.tsx` (the `tiles` array, the `useEffect` shuffle, the `Link` + `img` + italic title markup).
   - Same imports, same styling — no other sections.

2. **Update `src/routes/blog2.$slug.tsx`**
   - Replace `<PostMinimal post={post} />` with a 2-col grid wrapper:
     ```
     <div className="post-minimal-page py-10 md:py-16">
       <div className="mx-auto max-w-[1240px] px-5 md:px-8 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
         <aside className="order-2 lg:order-1"><PostTilesSidebar /></aside>
         <div className="order-1 lg:order-2"><PostMinimal post={post} /></div>
       </div>
     </div>
     ```
   - To avoid double background/padding, add a `bare` (or `noFrame`) prop to `PostMinimal` that skips the outer `post-minimal-page py-10 md:py-16` wrapper when rendered inside the grid. The inner `post-minimal-card` and all content stay identical.

3. **No changes** to `/blog2` index, `PostSplit`, `/blog`, or the shared `Sidebar` component.

### Notes / caveats

- On mobile (`<lg`), tiles stack **below** the article (via `order-1`/`order-2`) so the reading experience isn't pushed down. If you'd rather hide them on mobile, say the word and I'll add `hidden lg:block` to the aside instead.
- Tiles link to `/post/$slug` (same as on `/blog`), not `/blog2/$slug`. Want me to repoint them to `/blog2/$slug` so users stay in the blog2 reading experience? Default: keep as-is.
- Max width grows from 960px (current blog2 card) to ~1240px to fit the 240px tile column + card. Card itself stays the same width.
