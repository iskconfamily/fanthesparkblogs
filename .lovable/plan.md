## Goal
Go back to the **centered hero with the FTS stamp + crowd-silhouette background** (like the original live site and image-123 reference) — text below the stamp — and keep the **alternating CTA styling** (one filled orange, one ghost outline) from the current build.

## Changes — `src/routes/home.tsx`, `Hero` only

### Background
- Re-import `hero-stamp-background.png` (the asset already exists in `src/assets/`).
- Section becomes:
  - `backgroundColor: #f2f0ea`
  - `backgroundImage: url(heroStampBg)`
  - `backgroundRepeat: no-repeat`
  - `backgroundPosition: center top`
  - `backgroundSize: 100% auto` (keeps stamp at natural proportion, crowd silhouette bleeds across the bottom)
  - `paddingBottom: 80px`
- Drop the separate transparent `stamp` `<img>` element — the stamp is part of the background image.

### Layout (centered, text below stamp — matches image-123)
- Single centered column, `max-width: 760px`, `padding: 0 24px`.
- `padding-top: clamp(280px, 36vw, 460px)` so the content clears the stamp area of the background image.
- All content centered: eyebrow → welcome paragraph → CTAs.
- Remove the two-column grid and the `order` overrides.

### Content (unchanged copy)
1. SEO-only `<h1 className="sr-only">Fan The Spark</h1>`.
2. Eyebrow `FAN THE SPARK` — uppercase, tracked `0.28em`, 12px, `#c2542a`, `var(--font-meta)`, centered.
3. Welcome paragraph (approved copy, centered):
   > "Welcome to the Fan The Spark website where you will find encouragement and support for expanding your book distribution, sadhana, and understanding of sastra. Click the links below to learn more."
   - `var(--font-serif-body)` (lighter than the display serif — fits the centered paragraph), `clamp(16px, 1.4vw, 19px)`, line-height 1.6, color `#6b6448`, `max-width: 620px`, `margin: 0 auto 40px`.

### CTAs (keep current alternating style)
- `HeroCTA` component unchanged (primary = filled orange `#e8623c`/white; default = ghost transparent with orange border `#c2542a`).
- Row centered with `justify-center`:
  - **Lord Chaitanya** → `/wisdom/lord` — `primary` (filled).
  - **Disciple of Srila Prabhupada** → `/my-journey/my-guru` — default (ghost outline).

## Out of scope
- No other section changes.
- No copy or route changes.