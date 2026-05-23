## Decision

- **Layout pattern (web layout, all non-blog pages):** Option C — full-width sections, prose constrained to ~720px inside.
- **Photos:** Yes, both uploaded images work well — they bookend the narrative (opening calm/meditation, closing devotion).

## Photo placement on /my-story

- **`image-78.png` (forest, meditative, "MY STORY" already overlaid on right):**
  Full-bleed **hero section** at the top of the page. Title "My Story" rendered by us (not from image) over the left side of the photo with a soft warm gradient overlay so text stays legible. Eyebrow "My Journey" above. Crop the image to ~60vh on desktop, ~50vh on mobile. We'll mask/hide the right side that already has "MY STORY" baked in by using `object-position: left` and our overlay covering that area — or crop it cleanly.
  - Save to: `src/assets/my-story/hero-forest.jpg`

- **`image-79.png` (white robes, temple pillars, namaste):**
  Full-bleed section near the **end** of the narrative, just before the closing CTA. Acts as a visual breath after the long read. Caption/eyebrow underneath optional.
  - Save to: `src/assets/my-story/temple-namaste.jpg`

## Page structure (Option C applied)

```
<SiteLayoutWeb>
  <section> ← full-bleed hero with forest photo + title overlay
  <section> ← cream background band, prose 720px: lead paragraph
  <section> ← full-bleed YouTube embed in a 960px container
  <section> ← cream background band, prose 720px: body + pull-quote + more body
  <section> ← full-bleed temple photo
  <section> ← prose 720px: final 2 paragraphs + dots + CTA
</SiteLayoutWeb>
```

Each `<section>` controls its own background and inner max-width. Header/footer untouched.

## Files

- `src/routes/my-story.tsx` — restructure into full-bleed sections; keep all existing copy verbatim
- `src/assets/my-story/hero-forest.jpg` — copy from `user-uploads://image-78.png`
- `src/assets/my-story/temple-namaste.jpg` — copy from `user-uploads://image-79.png`

## Pattern for future web-layout pages (Contact, About, etc.)

Same recipe: page = stack of full-width `<section>` elements, each with its own inner `max-w-[720px]` (prose) or `max-w-[1200px]` (wider blocks like image grids or two-column). I'll apply this to `/contact` in a follow-up if you want.

## Not touched

Blog (`SiteLayout`, sidebar, post pages, RSS, admin), header, footer, design tokens, DB.

## Note on the forest image

The uploaded crop already has "MY STORY" + dots typeset into the photo on the right. Two options — I'll default to **(a)** unless you say otherwise:
- **(a)** Use the image as background, crop/position so the baked-in text falls off-canvas or is covered by our overlay, and render our own title on the left in brand typography. Consistent with the rest of the site.
- **(b)** Use the image as-is with the baked-in text visible. Faster but the typography won't match brand fonts and the text isn't selectable/SEO-readable.
