## Goal

Keep the current **light FTS stamp background image** and the approved **welcome copy** — only change the layout around them. Move from centered → left-aligned editorial composition inspired by image-121 (eyebrow, large headline-style text block, CTA row, all flush left).

## Changes — `src/routes/home.tsx`, `Hero` only

### Background (unchanged)
- Keep `heroStampBg` (FTS_LogoStamp_WithBackground) as the section background.
- Switch positioning so the stamp sits on the **right** side instead of dead center, freeing the left half for the text column. Use `background-position: right top` (or `right 5% top`) with `background-size: contain` so the stamp renders at a controlled size (~520–620px wide) and the soft crowd silhouette still bleeds across the section.
- Keep `background-color: #f2f0ea`.
- Section `min-height: min(80vh, 720px)`.

### Layout (new)
- Container: `max-width: 1200px`, centered, `padding: 0 32px`.
- Two-column flex on desktop (≥900px): left column ~52% holds text + CTAs; right column ~48% is empty space that lets the stamp (in the background) show through.
- Mobile (<900px): single column, text stacks below the stamp. Use `background-position: center top` and `padding-top` large enough to clear the stamp.

### Left text column (top → bottom, all left-aligned)
1. **Eyebrow**: `FAN THE SPARK` — uppercase, tracked `0.28em`, 12px, orange `#c2542a`, `var(--font-meta)`.
2. **Welcome paragraph** (approved copy, used as the hero statement):
   > "Welcome to the Fan The Spark website where you will find encouragement and support for expanding your book distribution, sadhana, and understanding of sastra. Click the links below to learn more."
   - Rendered large: `var(--font-serif-display)`, `clamp(26px, 3vw, 38px)`, line-height ~1.3, color `#3a3623` (dark warm), max-width ~520px.
   - SEO `<h1 className="sr-only">Fan The Spark</h1>` retained.
3. **CTA row** (live-site pair, unchanged routes):
   - **Lord Chaitanya** → `/wisdom/lord` — solid orange filled (current style kept).
   - **Disciple of Srila Prabhupada** → `/my-journey/my-guru` — outlined ghost variant (1px solid `#c2542a`, transparent bg, orange text) to give visual hierarchy between primary and secondary.

### Vertical alignment
- Left column vertically centered within the section (`align-items: center` on the flex row) so the text sits roughly at the stamp's vertical midpoint.

## Out of scope
- No copy changes beyond removing the centered layout.
- No other section changes.
- No routing/nav changes.