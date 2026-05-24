## Files I'll edit

Only one file: **`src/routes/home.tsx`**. No changes to header, menu, footer, blog, or shared components.

## New Home page section order

```
Hero (unchanged)
Start Here row (swap order, fix image)
My Guru — featured section (NEW)
Latest Videos (NEW)
Latest Audio (NEW)
My Story — featured section (NEW)
Books & Teachings (NEW)
Upcoming events (unchanged, if any)
Wisdom & Teachings — Read articles only (trim Watch + Listen, since they move up)
How Can I Be Of Service (ServeBand — kept)
Servant Leaders + Stories (kept)
```

## Section-by-section

**1. Start Here row** — In `QuickLinks`/`JourneySplit` area. Note: the current "Start Here" row is the 4 icon tiles (Ask / Small Groups / Retreats / Serve). The image cards (My Story / My Guru) live in a separate `JourneySplit` row right below. I'll treat `JourneySplit` as the "Start Here row with cards" you mean:
- Reorder tiles: **My Guru left, My Story right**.
- Fix My Guru image cropping: change `objectPosition` from `center top` to a value that shows the subject's face (around `center 30%`) and increase the card aspect ratio slightly so it doesn't crop tightly.

**2. My Guru featured section (NEW)** — Full-width band, inner container `max-w-[1100px]`. Two-column on desktop (image left ~5/12, text right ~7/12), stacked on mobile. Uses `guruImg`, eyebrow "My Journey", italic serif heading "My Guru", short paragraph teaser, primary CTA button "Read About My Guru" → `/my-journey/my-guru` (note: your spec said `/my-guru`, but the actual route is `/my-journey/my-guru` — I'll use the real route).

**3. Latest Videos (NEW)** — Section titled "Latest Videos", eyebrow "Watch". 2-up responsive grid of YouTube embeds using the responsive `YouTubeEmbed` wrapper (already in file). Since the channel's uploads playlist (`UULFlKbqEU-IufWUuiBO_Z4FuQ`) currently fails to load, I'll embed **two hardcoded recent video IDs** as placeholders that you can swap out, plus a "Watch More →" link to the channel. (If you want me to fetch the real latest IDs, I'd need the YouTube Data API key — let me know.)

**4. Latest Audio (NEW)** — Section titled "Latest Audio", eyebrow "Listen". One responsive SoundCloud embed pointing at the latest tracks (using the existing user `192337999` "Latest Tracks" feed from `wisdom.audio-playlists.tsx`, which is known-good) wrapped so it can't overflow on mobile. CTA "Listen More →" → `/wisdom/audio-playlists`.

**5. My Story featured section (NEW)** — Mirror of the My Guru section but image right / text left for visual rhythm. Uses `storyImg`, CTA "Read My Story" → `/my-journey/my-story`.

**6. Books & Teachings (NEW)** — Section title "Books & Teachings". Two book cards side-by-side on desktop, stacked on mobile. **I don't have book cover assets or titles in the project** (`src/assets` has no book imagery beyond `blog-gita-book.jpg`). I'll scaffold the section with two placeholder cards (cover image slot using `blog-gita-book.jpg` as a stand-in, title, one-line description, "Learn more" link). You can hand me the covers + titles + links and I'll wire them in afterward.

**7. Wisdom & Teachings trim** — Since Watch and Listen are promoted into their own sections above, I'll reduce the existing `WisdomTeachings` to just the **Read** column (latest 3 articles) so content isn't duplicated. The eyebrow becomes "Read" and heading "Latest Writings". If you'd rather keep Watch/Listen duplicated inside this section too, say the word.

**8. How Can I Be Of Service** — `ServeBand` + `ServantStories` kept exactly as is, just repositioned after the books section. Spacing left untouched.

## Design notes

- Reuse existing tokens: `--font-serif-display` italic for headings, `--font-meta` uppercase eyebrows, `--brand-gold` rules, warm cream/olive palette.
- Featured sections alternate background: My Guru on `var(--background)`, My Story on the soft cream band (`color-mix(... olive 6%, background)`) for editorial rhythm.
- Generous vertical padding (`90–110px`), inner containers `max-w-[1100px]`, natural image crops (no heavy darkening overlays on the featured sections — those overlays stay only on the small `JourneySplit` cards).
- CTAs in featured sections use the same outlined/filled button style as the Hero CTAs for consistency.

## Open items I'll need from you after this lands

- Book titles, covers, and links for the Books & Teachings section.
- Confirm whether to fetch real "latest" YouTube IDs via API, or you'll hand me 2 video IDs.
