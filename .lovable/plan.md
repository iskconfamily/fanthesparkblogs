
## Goal

Make the newsletter email render every blog block with the same layout, image placement, and visual hierarchy as the website. One source of truth for content (`blocks` JSONB), two renderers (web + email) that stay in lockstep.

## Current gaps (site vs email)

The website renders 10 block types via `src/components/article-body.tsx`. The email renderer in `src/lib/email.functions.ts` currently:

- Skips `gallery`, `newsletter-cta`, and `heading` level 3 entirely (they vanish from the email).
- Ignores inline markdown (bold/italic/links written with `**…**`, `*…*`, `[label](url)`) — site uses `renderInline`, email escapes raw text.
- Uses a 240px image column for `image-text`; site uses an even 50/50 grid.
- Uses 260px for `side-right`/`side-left`; site uses `~44%` up to 280px.
- Doesn't differentiate `callout` tone (note vs warning).

So a blog that looks complete on the site can show up in the email missing sections or with images sized/placed differently.

## What will change

All edits are in `src/lib/email.functions.ts` — no schema, no website changes.

### 1. Inline markdown
Add an email-side `renderInlineHtml(text)` that mirrors `src/lib/markdown-inline.tsx`:
- `**bold**` → `<strong>`
- `*italic*` → `<em>`
- `[label](https://…)` → `<a href="…" style="color:SANDSTONE;text-decoration:underline;">label</a>`
- Everything else escaped.

Use it in `paragraph`, `quote`, `pull-quote`, `callout`, and image-text body.

### 2. Heading level 3
Render `heading.level === 3` as an `<h3>` (smaller, same family/italic) to match the site.

### 3. Image-text → 50/50 table
Replace the 240px-column rendering with a two-column `<table>` where each `<td>` is `width="50%"`, image side controlled by `imageSide`, caption under the image, paragraphs in the other column. Matches `md:grid-cols-2 gap-8`.

### 4. Side-right / side-left figures
Use `width="44%"` with `max-width:280px` and `align="right"`/`align="left"` to let body text wrap, matching the site's `w-[44%] max-w-[280px]`.

### 5. Gallery
Render as a `<table>` with 2 or 3 equal-width columns (driven by `columns`), each cell holding `<img>` + optional caption. Matches `md:grid-cols-2` / `md:grid-cols-3`.

### 6. Newsletter CTA
Render as a bordered section with the site's sandstone background, a short heading ("Stay in touch") and a button linking to `${SITE_URL}` — email recipients are already subscribed, so this is a "read more on the site" CTA, not a duplicate signup form. Matches the spirit of `InlineNewsletter` without re-prompting an email address.

### 7. Callout tone
`tone === "warning"` uses a warmer border/background; `note` keeps the existing styling.

### 8. Text fallback
Extend `blocksToText` to cover `gallery` (`[gallery: N images]`), `newsletter-cta` (`Read more on the site: <url>`), and heading level 3.

## Out of scope

- No changes to the website renderer, the block schema, or the AI studio prompts.
- No new block types.
- Hydration warning in the sidebar newsletter (LastPass extension artifact) is unrelated and not touched here.

## Verification

After the edit, send a test email for the "Overnight Success" post and confirm:
- Hero `side-right` image floats right with text wrapping beside it (not stacked above).
- Pull-quote ("I trained 17 years…") renders centered in display italic.
- Signature image stays small and centered above the author line.
- Any blog containing a gallery, an h3, a newsletter CTA, or inline `**bold**` / links shows them correctly in the email.

## Technical notes

- All layout uses email-safe `<table>` / `align` attributes — no flexbox/grid.
- `renderInlineHtml` runs on already-escaped segments; URL is validated to start with `http(s)://` or `/` to avoid `javascript:` injection.
- Existing `jsonBlocksToEmail` → `ContentBlock` union is extended with `gallery`, `newsletter-cta`, and `heading.level`; `renderBlocks` handles each new variant.
