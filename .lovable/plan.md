## Goal
Show the three testimonials from the attached image on the home page (`/`) as a horizontal row, and also show them on `/serve/transformational-stories`.

## Content (from your screenshot)
1. "Vaisesika Dasa is a treasure - if you ever have the opportunity to hear him, take it!" — *Paul, Silicon Valley – USA*
2. "If your goal is towards 'simple living, high thinking', then, Vaisesika Dasa's talk covered it! Really simple real life examples and how we can implement them to eventually lead a calm and peaceful life. DE-CLUTTER!" — *Rashmi, Silicon Valley – USA*
3. "The speaker and the topic was both timeless and timely. The audience was very tuned in to the topic. We need more of these!" — *Anonymous*

## Changes

1. **New shared component** `src/components/testimonials-row.tsx`
   - Exports `TESTIMONIALS` (array of `{ quote, author }`) and a `<TestimonialsRow />` component.
   - Layout: a section with eyebrow ("Kind Words" / "Transformational Stories"), then a 3-column grid (`grid-cols-1 md:grid-cols-3`, gap-8). On `/home` the main column is 720px wide, so it will gracefully collapse to 1 column on narrow space and 3 columns on wider — we'll use `sm:grid-cols-3` so all three sit in a row even within the 720px main column (cards become compact). The transformation-stories page is full-width via `Prose` (720px) — same treatment, 3 across on `sm+`.
   - Each card: serif italic quote (var(--font-serif-body), ~15–16px, line-height 1.6) and orange italic byline matching screenshot (`color: var(--brand-orange, #e85d3a)`, var(--font-serif-body), italic, bold, uppercase tracking-wide small caps-ish small text).
   - No borders/cards background — clean type-only to match the screenshot.

2. **`src/routes/index.tsx`**
   - After the posts list (still inside `SiteLayout`'s main column), render `<TestimonialsRow heading="Kind Words" />`.

3. **`src/routes/serve.transformational-stories.tsx`**
   - Inside the existing `body` (after the current `<Para>`), render `<TestimonialsRow />` (no extra heading, since the page already says "Transformational Stories").

## Notes
- No backend, no new routes — purely presentational.
- Reuses existing CSS tokens (`--font-serif-body`, `--brand-orange` / falls back to the orange already seen in the screenshot `#e85d3a`).
- No changes to the sidebar, layout chrome, or other pages.
