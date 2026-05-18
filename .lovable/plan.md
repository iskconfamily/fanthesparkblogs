## Goal
Email newsletter should include the full article body (matching the site), not just the excerpt + CTA.

## Root cause
`src/lib/email.functions.ts` → `buildEmail()` reads only the `content` text field and parses it for paragraphs/headings/quotes/figures. Posts created with the AI block editor (like *Advent of the Bhagavad-gita*) store their body in the `blocks` JSONB field, leaving `content` empty. With no content to parse, the email falls back to just the excerpt + hero image + "Read on the site" button.

## Fix
1. **Select `blocks` from DB** — add `blocks` to the `select(...)` in `sendBlogAnnouncement`.
2. **Render from blocks first** — in `buildEmail`, if `post.blocks` is a non-empty array, convert it into the existing `ContentBlock[]` shape and render via `renderBlocks()` / `blocksToText()`. Mapping:
   - `paragraph` → `{ type: "p", text }`
   - `heading` → `{ type: "h2", text }`
   - `quote` → `{ type: "quote", text }` (cite appended in italics if present)
   - `image` → `{ type: "figure", src, alt }` — respect `layout: "inline-small"` and signature detection (small max-width, no caption) so the signature doesn't blow up to full width in email
   - `divider` → render as `<hr>` (extend `ContentBlock` union with a `divider` type)
   - `callout` → render as a left-bordered box (extend union with `callout`)
3. **Fallback** — if no blocks, keep current behavior (parse `content`, else excerpt-only).
4. **Hero image placement** — when rendering from blocks, do NOT inject `featured_image` after the first paragraph (blocks already contain their own image positioning, including the hero). Only inject the featured image when falling back to the legacy excerpt-only path.

## Out of scope
- Changing the email layout/style.
- Changing how the "Appreciation" or other posts store their body.
- The admin "Edit post" textarea (separate confusion — already discussed).