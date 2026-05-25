# Add author portrait to email byline

## Goal
Mirror the web byline (small circular portrait + author name + date) inside the email HTML produced by `buildBlogEmailHtml` in `src/lib/email-html.ts`, so emails match `/blog2` and `/blog3`.

## Approach

1. **Host the portrait at a public URL.** Email clients can't load `@/assets/...` bundle URLs — they need an absolute `https://` src. Upload `src/assets/vaisesika-portrait.jpg` to a public Cloud storage bucket (e.g. `email-assets/vaisesika-portrait.jpg`) and use the returned public URL as a constant in `email-html.ts`.

2. **Update the byline block in `buildBlogEmailHtml`.** Replace the current text-only byline:
   ```
   <div style="${BYLINE}">By ${esc(post.author)}</div>
   ```
   with an email-safe table layout (tables are the only reliable way to align an image next to text across Gmail, Outlook, Apple Mail):
   ```
   <table><tr>
     <td width="40"><img src="<public url>" width="40" height="40"
          style="display:block;border-radius:9999px;" /></td>
     <td style="padding-left:12px;">By {author} • {DATE}</td>
   </tr></table>
   ```
   Keep the existing `BYLINE` typography tokens. Move the date into the byline row (it's currently a separate `DATE_META` block above) so the layout matches the web exactly — one portrait, one line with name + date.

3. **No other changes.** Templates, sending pipeline, web bylines all stay as-is.

## Caveats (already discussed, just noting)
- Some Android Gmail builds strip `border-radius` → portrait appears square. Acceptable fallback.
- Recipients who don't click "show images" see alt text (`Vaisesika Dasa`) instead of the portrait — the author name is also in the adjacent text cell, so the byline is never broken.

## Files touched
- `src/lib/email-html.ts` — add `PORTRAIT_URL` constant, rewrite the byline section inside `buildBlogEmailHtml`, drop the separate `DATE_META` block (date moves into byline row).
- One-time upload of `src/assets/vaisesika-portrait.jpg` to a public bucket (no code change beyond using the returned URL).

## Not in scope
- Wiring actual email sending (no email infra exists yet).
- Changing web bylines.
- Gravatar lookup.
