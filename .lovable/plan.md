## Goal

Build the redesigned homepage at a new route `/home`. Keep current `/` route (existing blog-style temp home) untouched. Pull richer book copy from existing book blog posts in the project; fall back to fanthespark.com / Amazon descriptions where needed.

## Routing

- **Keep** `src/routes/index.tsx` as-is → still serves `/`.
- **Create** `src/routes/home.tsx` → serves `/home`, contains the new editorial homepage.
- `head()` on `/home` gets its own title/description/og metadata.
- No nav/menu changes in this step — `/home` is reached by typing the URL. We can swap which route the menu points at after review.

## Sections (unchanged from prior plan)

1. **Hero** — full-bleed `my-story/prabhupada-with-devotees.jpg`, dark gradient overlay, FTS stamp, tagline, two CTAs (Read the blog → `/wisdom/blog`, My Story → `/my-journey/my-story`).
2. **Start Here** — 4-up card row (Ask VD, Small Groups, Spiritual Retreats, Serve Selflessly).
3. **Latest Articles** — 3-up editorial grid from `getPublishedDbPosts()` merged with static posts.
4. **My Journey preview** — two-tile split (My Story / My Guru).
5. **Upcoming Events** — 3-up cards via `getUpcomingEvents({ limit: 3 })`.
6. **Watch & Listen** — combined YouTube + audio playlists strip.
7. **Books & Resources** — see updated content sourcing below.
8. **How Can I Be Of Service?** — 3 inline links (Give, Volunteer, Servant Leaders).
9. **Servant Leaders + Transformational Stories** — paired editorial row.
10. **Footer** — unchanged `SiteFooter`.

## Books section — content sourcing (updated)

Order of preference for each book card's blurb:
1. **Existing book blog post in this project** — scan `blog_posts` table + static posts for entries tagged/categorized as books (e.g. "Our Family Business", "The Four Questions"). Use the post's `excerpt` (or first paragraph of `content`) as the card blurb, and link "Learn more" to that blog post URL instead of generic `/wisdom/blog`.
2. **fanthespark.com live copy** — if no matching blog post exists, pull the short book description from the current site's books section.
3. **Amazon description** — fall back to the published Amazon book description, lightly trimmed.

Implementation: in the `/home` loader, after fetching posts, do a simple client-side match (slug/title/tag contains "four-questions" or "family-business") to attach `bookPostSlug` + `bookExcerpt` to each book card. Hard-coded fallback strings (sourced from fanthespark.com / Amazon) live in the books component for the no-match case.

Cover images: existing book cover assets in `src/assets/` (or pull from the live site if missing — flagged before implementation if not found).

## Data wiring

`/home` loader runs `Promise.all([getPublishedDbPosts(), getUpcomingEvents({ limit: 3 })])` via `ensureQueryData` + `useSuspenseQuery`. No new server functions.

## Components

Created under `src/components/home/`: hero, quick-links, latest-articles, journey-split, upcoming-events, watch-listen, books-resources, serve-band, servant-stories. Use existing design tokens. `/home` uses `SiteLayoutWeb` for full-bleed.

## URLs after this change

- `/` → existing blog page (unchanged)
- `/home` → new redesigned homepage

Ready to implement on approval.
