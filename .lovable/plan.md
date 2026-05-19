## Goal

Close the remaining gap between the website article (screenshot 1) and the Brevo email (screenshot 2). Two concrete differences are visible:

1. **Missing article header** — site shows *Overnight Success* (italic display), `MAY 18, 2026` (uppercase meta), a divider rule, and `BY VAISESIKA DASA` byline. The email currently starts straight at the featured image.
2. **Image `layout: "side-right"` is ignored in email** — the path photo with caption "A steady effort over time" floats right of the opening paragraph on the site. In the email it renders full-width above the text. Same for `side-left` and `inline-small`.

Everything else (fonts, colors, paragraph leading, pull-quote, divider, quote) already matches.

## Files touched

- `src/lib/email-html.ts` — render header + handle image layouts
- `src/lib/email.functions.ts` — pass `date` and `author` into `buildBlogEmailHtml` (data already loaded from `blog_posts`, only `date` field needs to be added to the select + type)

No changes to the editor UI, send flow, params shape, or on-site components.

## Changes

### 1. Article header in blog_html

Prepend, after the `@import` style block and before the lead/excerpt:

- Title — `<h1>` with display font, italic, color `#7e6c2a`, ~36px/1.15, weight 500, margin `0 0 6px`. Matches `PostArticle` title styling.
- Date — meta font, uppercase, `letter-spacing:0.18em`, 12px, color `#7a6a55`, margin `0 0 18px`. Format via `formatDate` from `content/queries.ts` (already used on site).
- Horizontal rule — `1px solid #d4c8b0`, margin `0 0 12px`.
- Byline — meta font, uppercase, `letter-spacing:0.28em`, 11px, weight 600, color `#7a6a55`, text `BY {author}`, margin `0 0 28px`.

Header is only emitted when the field exists; date falls back to nothing if missing.

### 2. Image layout support

In `blockToHtml` for `type === "image"`, branch on `b.layout`:

- `side-right` / `side-left` — wrap with an email-safe two-column structure: a single `<table align="right|left" width="44%" style="max-width:280px;margin:0 0 12px 16px">` (or `margin:0 16px 12px 0` for left). Inside: `<img>` + optional `<figcaption>` (left-aligned). This is the most reliable way to get text wrapping in Gmail/Apple Mail — pure CSS `float` is stripped by Gmail; `align` on a table is honored.
- `inline-small` — center, `width:60%; max-width:380px; margin:24px auto;`, caption centered.
- `hero` / `full` / unset — current full-width behavior (unchanged).

Featured image keeps its current full-width hero treatment.

### 3. Wire date/author through

In `email.functions.ts`:
- Extend the select to include `date` (already on the table — already used elsewhere).
- Extend `EmailHtmlPost` and `buildBlogEmailHtml` calls with `date` and `author`.

## Caveats

- Outlook (Windows desktop) ignores `align` on tables for true text wrap — the side image will appear stacked above the paragraph there. Gmail web/iOS, Apple Mail, and Outlook.com handle it correctly, which covers the bulk of recipients.
- No change to the Brevo template — chrome still belongs to the template (`{{ params.blog_html }}` stays inner-content-only).

## Verification

Send a test of the *Overnight Success* post and confirm in Gmail: title + date + divider + byline appear, the path photo floats right of the opening paragraph with its caption beneath, and everything else (lead excerpt, pull-quote, body) is unchanged.
