## Goal
Redesign `/blog2/:slug` individual post layout to match the uploaded reference: clean editorial article on a cream/white card, blue uppercase category eyebrow, large serif italic title, minimal byline, roomy body text, and quotes with a gold left border + small muted citation.

Scope: visual only. No data/route changes. Only `/blog2/:slug` is affected — `/blog`, `/blog3`, and the existing `/post/:slug` layouts stay as they are.

## Changes

### 1. `src/components/blog-layouts/PostMinimal.tsx` (rewrite layout)
- Outer page: warm cream background (`bg-[oklch(...)]` token already in theme, or a subtle off-white). Center an article "card" with white background, subtle border, rounded corners, generous padding, max-width ~960px.
- Eyebrow: category in **blue**, uppercase, wide tracking (`text-[11px] tracking-[0.22em]`), using a blue token (add `--accent-blue` to `styles.css` if not present).
- Title: large serif italic (`var(--font-serif-display)`, italic, ~`text-5xl md:text-6xl`), warm dark brown/black color.
- Byline: simple muted line "BY {AUTHOR} · {DATE}" in uppercase tracked meta font. No portrait avatar in this layout (matches reference). Pass a `variant="minimal"` style — render inline instead of using the existing `<Byline>` which includes the portrait.
- Body: serif body text at comfortable size (`text-lg md:text-xl`, leading-relaxed), paragraph spacing generous.
- Quote block (reference's gold-bordered quote): override the default `ArticleBody` quote style for this layout. Two options:
  - (a) Add a `variant` prop to `ArticleBody` / quote renderer, or
  - (b) Pass a `className` wrapper and let local CSS scope override quote styles via a wrapping class like `.post-minimal-v2 blockquote { border-left: 3px solid var(--accent-gold); ... }`.
  - Going with (b) — scoped CSS class wrapper — to avoid touching shared `ArticleBody` API.
- Signature line at end ("Vaisesika Dasa" in serif italic) — render author name in serif italic below the body, matching reference.
- Footer "← Back to index" link stays, but restyled subtle.

### 2. `src/styles.css` (additive tokens only)
- Add (if missing): `--accent-blue` (the bright blue used for "REFLECTIONS"), `--accent-gold` (the olive-gold quote border), `--surface-card` (white card on cream), `--surface-page-cream` (warm page background).
- Add scoped CSS rules for `.post-minimal-card blockquote` to style quotes per reference (gold left border, italic serif body, small muted cite line).

### 3. `src/routes/blog2.$slug.tsx` (no change needed)
- Already renders `<PostMinimal post={post} />`. The route stays the same.

## Out of scope
- `/blog` (editorial layout) — untouched.
- `/blog3/:slug` (PostSplit) — untouched.
- `/post/:slug` (main site) — untouched.
- Data fetching, routing, navigation — untouched.

## Verification
- Visit `/blog2/fresh-and-easy` and `/blog2/overnight-success` in preview, screenshot, compare to reference (title style, eyebrow color, quote border, byline simplicity, page cream background).
