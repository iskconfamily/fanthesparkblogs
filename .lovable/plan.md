
# Site restructure — scaffold all routes

Build out the full information architecture as placeholder pages so the nav and URLs are live. Real content per section comes in follow-up turns.

## New route files (all under `src/routes/`)

Flat dot-separated naming (TanStack convention):

```
my-journey.tsx                          → /my-journey (index w/ links to 2 children)
my-journey.my-story.tsx                 → /my-journey/my-story (move existing content here)
my-journey.my-guru.tsx                  → /my-journey/my-guru  (move existing content here)

wisdom.tsx                              → /wisdom (hub index)
wisdom.blog.tsx                         → /wisdom/blog (lists published posts, reuses index logic)
wisdom.blog.$slug.tsx                   → /wisdom/blog/:slug (reuses post.$slug logic)
wisdom.videos.tsx                       → /wisdom/videos
wisdom.audio-playlists.tsx              → /wisdom/audio-playlists

next-steps.tsx                          → /next-steps (hub index)
next-steps.ask.tsx                      → /next-steps/ask
next-steps.small-groups.tsx             → /next-steps/small-groups
next-steps.spiritual-retreat.tsx        → /next-steps/spiritual-retreat

events.tsx                              → /events

serve.tsx                               → /serve (hub index)
serve.volunteer.tsx                     → /serve/volunteer
serve.give.tsx                          → /serve/give
serve.transformational-stories.tsx      → /serve/transformational-stories
```

## Existing routes — what changes

- **Delete** `src/routes/my-story.tsx` and `src/routes/my-guru.tsx` (content moves to `my-journey.my-story.tsx` / `my-journey.my-guru.tsx` verbatim — same components, same images, same ContactSection wiring).
- **Keep** `src/routes/post.$slug.tsx` exactly as-is. Existing posts continue working at `/post/:slug`.
- **`/wisdom/blog`** becomes the new canonical blog landing. `wisdom.blog.$slug.tsx` proxies to the same loader/component as `/post/:slug` so both URLs render the same essay (canonical stays `/post/:slug` for now to avoid SEO churn).
- **Keep** `/archive`, `/about`, `/newsletter`, `/contact`, `/surprise`, `/admin*`, `/rss.xml` untouched.

## Placeholder page shape

Each new placeholder uses `SiteLayoutWeb`, sets per-route `head()` (title, description, og:title, og:description), and renders a hero + short copy + `ContactSection` at the foot with a sensible `defaultCategory`. Hub indexes (`/my-journey`, `/wisdom`, `/next-steps`, `/serve`) render a simple card grid linking to their children using the shared `editorial` components for visual consistency with `/my-story`.

No new images generated yet — placeholders use type-only hero bands. Real imagery comes when each section gets its content pass.

## Header nav update

Update `src/components/site-header-web.tsx` to the new top-level IA:

```
My Journey  ·  Wisdom  ·  Next Steps  ·  Events  ·  Serve  ·  About  ·  Contact
```

Each top-level link goes to its hub index. Dropdowns are out of scope for this pass — mobile menu lists all hubs and their children as a flat indented list.

## SEO

- Per-route `head()` on every new file with route-specific title + description + og:title + og:description.
- `<link rel="canonical">` on leaf routes only (not hubs, not __root).
- Update `src/routes/sitemap[.]xml.ts` if present (or skip if not) to include every new public route.

## Out of scope (explicit)

- No redirects from old `/my-story` and `/my-guru` (user chose "just replace them" — old URLs will 404).
- No real content for `/wisdom/videos`, `/audio-playlists`, `/events`, `/serve/*`, `/next-steps/*` yet. Placeholder copy only.
- No header dropdown menus, no breadcrumbs component, no design system changes.
- No imagery generation for new sections.

## Technical notes

- TanStack auto-regenerates `routeTree.gen.ts` — don't hand-edit.
- The shared `ContactSection` already accepts `defaultCategory`, so each placeholder passes a contextual value (e.g. `"Volunteer"` on `/serve/volunteer`, `"Small Groups"` on `/next-steps/small-groups`). Existing `category` enum in the form may need new options — will add to the dropdown in `src/components/contact-section.tsx` to cover the new sections.
- `/wisdom/blog` index reuses `getPublishedDbPosts` + `mergePosts` logic from `src/routes/index.tsx` (extracted into a small helper to avoid duplication).
