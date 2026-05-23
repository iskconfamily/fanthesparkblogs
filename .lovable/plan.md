## Goal

Stop depending on Mailchimp templates entirely. Lovable builds the complete, email-safe HTML (header + blog body + footer) and uploads it as the campaign's raw HTML via Mailchimp's `html` content field. This eliminates the Classic/Drag-and-Drop template mismatch and the `blog_html` section-key issue.

## What changes

### 1. New `buildFullBlogEmailHtml` in `src/lib/email-html.ts`

Wrap the existing `buildBlogEmailHtml(post)` body inside a complete, Mailchimp-compatible email document:

- Full `<!doctype html>` + `<html lang>` + `<head>` with:
  - `meta charset`, `meta viewport`
  - `<title>` = post title
  - Google Fonts `@import` (already in body, will be deduped)
  - Minimal email-reset CSS (`body{margin:0}`, `img{border:0;display:block}`, table reset)
  - One `@media (max-width:600px)` rule so the centered 640px column shrinks cleanly on mobile
- Outer 100% bg table → centered 640px container table (the email convention that survives Outlook, Gmail, Apple Mail).
- **Header**: site brand row — wordmark "FAN THE SPARK" in Cormorant Garamond italic, linked to `SITE_URL`, with the small tagline/date strip styled like the website header. Plain HTML/CSS, no images required (keeps it bulletproof).
- **Body**: existing `buildBlogEmailHtml(post)` output, unchanged, so it stays visually consistent with the site's `ArticleBody`.
- **Read on web** CTA button under the article → `${SITE_URL}/post/${slug}`.
- **Footer**:
  - "You're receiving this because you subscribed to Fan The Spark."
  - Physical address line (required by Mailchimp / CAN-SPAM — they will inject it anyway; we render our own so the look matches).
  - **Mailchimp merge tags** so the campaign passes compliance checks: `*|UNSUB|*` unsubscribe link, `*|LIST:ADDRESSLINE|*` address, `*|CURRENT_YEAR|*`. Mailchimp rejects regular HTML campaigns that lack an unsubscribe link or address — using the merge tags is the canonical fix and works for both **test sends** and **live sends**.
- Single signature for the new function: `buildFullBlogEmailHtml(post, { siteUrl }) → string`.

The existing `buildBlogEmailHtml` stays as-is and is still used by Brevo (which has its own template params flow).

### 2. Rewrite the Mailchimp path in `src/lib/email.functions.ts`

- Delete `MC_TEMPLATE_ID`, `getMailchimpTemplateSectionKey`, and the `template: { id, sections }` body.
- `createAndPrepareCampaign(post, fullHtml)` now does:
  ```
  PUT /campaigns/{id}/content
  { "html": fullHtml }
  ```
- `loadPostAndHtml` builds `fullHtml` via `buildFullBlogEmailHtml` instead of just the body fragment.
- Test send + live send call paths stay the same (`/actions/test`, `/actions/send`).
- Campaign `settings` gains `to_name: "*|FNAME|*"` for personalized greeting headers, and keeps `subject_line`, `preview_text`, `from_name`, `reply_to`.

### 3. Mailchimp requirements we explicitly satisfy

- ✅ Unsubscribe link via `*|UNSUB|*` (Mailchimp **requires** this in custom-HTML campaigns; without it the campaign cannot be sent).
- ✅ Physical address via `*|LIST:ADDRESSLINE|*` (required by CAN-SPAM; pulled from the audience's default address).
- ✅ `<!doctype html>` + valid `<head>`/`<body>` so Mailchimp's parser accepts the upload.
- ✅ Inline styles only (no external stylesheets beyond the Google Fonts `@import`, which Gmail strips gracefully without breaking layout — the font stacks fall back to Georgia/Times).
- ✅ Tables-for-layout centered 640px column, web-safe sizing, `max-width:100%` images.
- ✅ No template ID required — campaign content is uploaded as raw HTML, which bypasses Classic vs Drag-and-Drop template restrictions entirely.

### 4. No UI changes

The admin "Send test" / "Send live" buttons keep working — only the backend payload changes. No new env vars, no new secrets.

## Technical details

- Files touched:
  - `src/lib/email-html.ts` — add `buildFullBlogEmailHtml`.
  - `src/lib/email.functions.ts` — swap `createAndPrepareCampaign` body to `{ html }`, drop template lookup, drop `MC_TEMPLATE_ID`.
- Files unchanged: Brevo path, admin UI, blog adapters, all `.tsx`.
- Mailchimp endpoint reference: `PUT /3.0/campaigns/{id}/content` with `{ html: "<!doctype html>..." }` is the documented way to upload a full HTML campaign; sections/template are mutually exclusive with raw `html`.

## Out of scope

- No changes to how subscribers are managed in the Mailchimp audience.
- No change to the Brevo transactional flow.
- No new design tokens — reuses the existing email colors/fonts from `email-html.ts` so the email matches the site.
