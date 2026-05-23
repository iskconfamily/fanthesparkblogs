## Three small fixes

### 1. My Guru hero — remove "1896–1977"
File: `src/routes/my-journey.my-guru.tsx` (line ~107)
- Change the hero subline from `His Divine Grace A. C. Bhaktivedanta Swami Prabhupada · 1896–1977` to just `His Divine Grace A. C. Bhaktivedanta Swami Prabhupada`.
- Leave the dates in body prose (lines 117, 134, 299) and meta description untouched — those are biographical context, not the hero.

### 2. My Story hero — top of image still cropping on laptop
File: `src/routes/my-journey.my-story.tsx` (the `heroImageStyles` block)
- Current desktop rule uses `object-position: center 18%` with `object-fit: cover` and a `max-height: min(70vh, 760px)` cap, which clips the top of the photo on laptop-height viewports.
- Fix: anchor the image to the top so the head is never cropped. Switch the `@media (min-width: 1024px)` rule to `object-position: center top` and reduce the cap (e.g. `max-height: min(78vh, 820px)`) so it scales rather than clips. Same adjustment in the ultrawide rule (use `center top` instead of `center 24%`).
- No layout / overlay changes — the bottom title overlay stays as-is.

### 3. Home page — remove Upcoming Events block
File: `src/routes/index.tsx`
- Remove the `UpcomingEventsBlock` render (line ~54) and the component definition (line ~62+).
- Remove the now-unused imports: `EventCard`, `getUpcomingEvents`, `EventRow`, and the `useServerFn` / `useQuery` wiring for events.
- Drop `events` from the loader's `Promise.all` so the home page only loads posts.
- Events remain available at `/events` and in the header nav — only the home-page block is removed.

No backend, schema, or route changes.
