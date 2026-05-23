# Plan — My Story Hero + Author Byline

## Terminology going forward
- The current `/` route is now called the **Blog Homepage** (not "homepage")
- A future **Home** page will be built later and will eventually become the real homepage
- This plan does NOT touch the Blog Homepage — we'll discuss its hero separately

## Decisions locked in
- **My Story hero**: `VaisesikaDasa.png` (meditation, garden, wide cinematic)
- **Author byline on blog posts**: Yes — small circular portrait + name + date
- **Blog Homepage**: untouched this round
- **AI blog images**: kept as-is
- **`FTS_LogoStamp_WithBackground-02-2.png`**: saved to assets for future use, not placed yet

## What gets built

### 1. Asset imports
- `user-uploads://VaisesikaDasa.png` → `src/assets/my-story/vaisesika-meditation.png`
- `user-uploads://VaisesikaDasa10.png` → `src/assets/vaisesika-portrait.png` (author byline)
- `user-uploads://FTS_LogoStamp_WithBackground-02-2.png` → `src/assets/fts-logo-stamp-hero.png` (parked for the future Home page)

### 2. My Story page hero
Replace the broken AI forest image (`src/assets/my-story/hero-forest.jpg`) with `vaisesika-meditation.png`:
- Full-bleed hero, ~70vh
- Subtle dark gradient overlay at the bottom for headline legibility
- Headline + intro paragraph anchored bottom-left
- Existing layout, type, and copy preserved — only the image swaps

### 3. Author byline on blog posts
Add to the top of each blog post (under the title, above the body):

```text
[●] Vaiśeṣika Dāsa  ·  May 23, 2026  ·  6 min read
```

- 40px circular crop of `vaisesika-portrait.png`
- Name in body font, muted color for date + read time
- New reusable component `src/components/blog/AuthorByline.tsx` so future posts get it automatically

## Technical notes
- Images go into `src/assets/` (ES6 imports, bundled + hashed)
- No data model changes, no new routes, no backend work
- `hero-forest.jpg` left in place (not deleted) in case we want to revert

## Out of scope (later)
- Blog Homepage hero direction (using the logo stamp or otherwise)
- New `/home` page build
- Brand kit doc, manifesto page, favicon, asset cleanup
