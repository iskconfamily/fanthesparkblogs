## Goal
Make the announcement email feel like the website (same fonts, warm paper background, olive headings, sandstone CTA) and include the **full article body**, not just the excerpt.

## Changes — single file: `src/lib/email.functions.ts`

### 1. Match the site's visual identity in `buildEmail`

Pull the same tokens the site uses:
- **Background**: warm aged-paper `#fbf8f1` (outer) and `#fdfbf5` (inner card) — matches `--background`
- **Body text color**: warm olive-brown `#5a4a1f` for readability (slightly darker than site `--foreground` for email contrast)
- **Heading color**: olive `#7e6c2a` (site `--foreground`)
- **Primary / CTA**: sandstone `#f2673a` (site `--primary`)
- **Muted text**: `#8a7a55` (byline, eyebrow, footer)
- **Borders**: soft tan `#d9cdb3`

Typography (with Georgia fallback for Outlook):
- Pull Cormorant Garamond + Libre Baskerville + Libre Caslon Text via a `<link>` to Google Fonts in `<head>`
- Display headings: `'Cormorant Garamond', Georgia, serif` — italic for h1, matching the site
- Body paragraphs: `'Libre Baskerville', Georgia, serif` at 17px / line-height 1.75
- Eyebrow + meta: `'Libre Caslon Text', Georgia, serif`, uppercase, letter-spacing 0.18em

Layout:
- Outer container 640px max, warm paper background
- Inner card on `#fdfbf5` with 40px padding
- Featured image full-width, no border-radius (site uses square images)
- Eyebrow "New essay · Fan The Spark" in olive
- H1 italic Cormorant ~34px
- Byline "by Author" in meta font, small caps, muted
- Hairline divider below byline (matches site)
- Full article body
- Sandstone CTA "Read on the site" at the bottom (still useful for sharing / canonical link)
- Footer: small muted note about subscription

### 2. Render full article content (not excerpt)

- Select `content` in the Supabase query alongside the existing fields
- Add a small markdown-to-email-HTML renderer reusing the same block grammar as `src/lib/blog-adapter.ts` `parseContent`:
  - `## heading` → `<h2>` (Cormorant italic, 26px, olive, top margin 32px)
  - `> quote` → `<blockquote>` with left border in sandstone, italic Cormorant 22px
  - `![alt](url)` on its own block → `<img>` full-width with optional caption
  - Otherwise → `<p>` (Libre Baskerville, 17px/1.75, color `#5a4a1f`, margin 0 0 20px)
- Escape all text content with the existing `escapeHtml` helper before injecting
- Fallback to `excerpt` if `content` is empty (defensive — shouldn't happen for published posts)
- Update the plain-text version to include the full content too (strip markdown markers to plain lines)

### 3. Subject line and preheader

- Keep subject = post title (already correct)
- Add a hidden preheader (`<div style="display:none;...">`) with the excerpt — improves inbox preview without showing in the body

## Out of scope
- No DB schema changes
- No changes to the admin UI or the broadcast/test send flow — only the email HTML/text is updated
- No new dependencies

## Verification
- Send a test email to yourself from the admin "Send announcement" panel and compare side-by-side with the site
- Confirm fonts render in Apple Mail / Gmail (Cormorant + Libre Baskerville) and gracefully fall back to Georgia in Outlook
- Confirm full body text appears, including any `##` headings, quotes, and inline figures