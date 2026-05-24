## Problem
The current background image (`FTS_LogoStamp_WithBackground`) has the FTS circular stamp baked into the center of the PNG. Any attempt to push it "right" just crops the image — the stamp stays where it was drawn. That's why the welcome text is sitting on top of the stamp.

## Fix — separate the stamp from the background

Use the already-imported transparent stamp asset (`@/assets/fts-logo-stamp-hero.png`) as its own element, and use a plain warm-cream section background (no baked-in stamp). This lets the stamp live cleanly on the right of the hero while text stays on the left.

## Changes — `src/routes/home.tsx`, `Hero` only

### Background
- Remove the `heroStampBg` background-image. Section becomes a flat `backgroundColor: #f2f0ea` (warm cream that matches the live site).
- Drop the `heroStampBg` import (we'll keep the asset on disk in case we want it later).
- Re-import the transparent stamp: `import stamp from "@/assets/fts-logo-stamp-hero.png";`

### Layout (two-column, content left / stamp right)
Container: `max-width: 1200px`, padded `48px 32px`, vertically centered with `min-height: min(78vh, 680px)`.

Desktop (≥900px) — CSS Grid `grid-template-columns: 1.1fr 1fr`, `gap: 48px`, `align-items: center`:
- **Left cell**: text column (eyebrow + welcome paragraph + CTA pair), all left-aligned. Same content/styles as now, `max-width: 540px`.
- **Right cell**: the stamp `<img>` only, rendered at `width: 100%, max-width: 460px, height: auto`, centered within the cell.

Mobile (<900px) — single column: stamp first (centered, `max-width: 320px`), then text/CTAs left-aligned below. Use a Tailwind responsive class on the grid (`grid-cols-1 md:grid-cols-[1.1fr_1fr]`) for the switch.

### Optional polish
Add a very soft radial fade behind the stamp (`background: radial-gradient(circle, rgba(232,98,60,0.06), transparent 70%)`) to give it a subtle halo on the flat cream, since we're no longer using the crowd-silhouette plate. Skip this if it adds visual noise — flat cream is fine.

## Out of scope
- No copy changes.
- No CTA route/style changes.
- No other section changes.