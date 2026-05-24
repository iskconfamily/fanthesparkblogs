## Goal

Keep the visual design and section flow of the first `/home` direction. Replace any invented author-style/editorial copy with approved wording from the current fanthespark.com site, or fall back to neutral labels.

## Files touched

Only components under `src/components/home/` and `src/routes/home.tsx`. No design-token, layout, or routing changes.

## Content changes by section

### 1. Hero (`hero.tsx`)
- Replace invented tagline with the approved welcome text:
  > "Welcome to the Fan The Spark website where you will find encouragement and support for expanding your book distribution, sadhana, and understanding of sastra. Click the links below to learn more."
- Keep current hero image, stamp, and the two CTAs (Read the blog → `/wisdom/blog`, My Story → `/my-journey/my-story`).

### 2. Start Here (`quick-links.tsx`)
- Card titles only — no invented subtitles:
  - Ask Vaisesika Dasa → `/next-steps/ask`
  - Small Groups Near You → `/next-steps/small-groups`
  - Spiritual Retreats → `/next-steps/spiritual-retreat`
  - Serve Selflessly → `/serve`
- Remove any author-style blurbs beneath the labels. Keep iconography/visual treatment.

### 3. My Journey split (`journey-split.tsx`)
- For both tiles (My Story, My Guru): show title + image + CTA only. Drop any invented excerpt text. (No approved short excerpt is available on the current site for these tiles.)

### 4. Upcoming Events — unchanged (event data is from DB).

### 5. Wisdom & Teachings (rename + reorder)
- Rename section from "Watch & Listen" / "Books & Resources" grouping to **"Wisdom & Teachings"**.
- Replace `watch-listen.tsx` + remove `books-resources.tsx` from this section; create a single `wisdom-teachings.tsx` containing three stacked subsections in this order:
  1. **Watch** — latest YouTube embeds/thumbnails similar to current site. CTA: `Watch More →` linking to the FTS YouTube channel.
  2. **Listen** — latest SoundCloud playlist embed(s). CTA: `Listen More →` `/wisdom/audio-playlists`.
  3. **Read** — latest 3 published blog posts from DB (already loaded). Show image, category, title, date, and excerpt only when present on the post. CTA: `Read Articles →` `/wisdom/blog`.
- Use neutral labels only: Watch / Listen / Read. No invented intro copy.
- Books section is removed from the homepage in this pass (no approved short copy + user did not re-list it). Can be reintroduced later if desired.

### 6. How Can I Be Of Service? (`serve-band.tsx`)
- Use the existing approved heading "How Can I Be Of Service?" and keep the three link labels matching the current site (Give, Volunteer, Servant Leaders) pointing to `/serve/give`, `/serve/volunteer`, `/serve/servant-leaders`. No invented blurb copy.

### 7. Transformational Stories (`servant-stories.tsx`)
- Keep section but show only approved testimonial entries already present on the current FTS site. If none can be confirmed as approved, render the section with title + CTA to `/serve/transformational-stories` and omit invented quotes.

## What stays the same
- Overall layout, spacing, typography hierarchy, color treatment, full-bleed hero, section ordering apart from the Wisdom reorder above.
- Loader (`getPublishedDbPosts` + `getUpcomingEvents`) and route metadata.
- `SiteLayoutWeb` + `SiteFooter`.

## Out of scope
- No nav/menu changes.
- No new server functions.
- No changes to `/` (blog index) or other routes.

Ready to implement on approval.