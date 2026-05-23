## Naming

Rename the non-blog layout to **web layout**, blog stays **blog layout**.

- `src/components/site-layout-marketing.tsx` → `src/components/site-layout-web.tsx`
- `src/components/site-header-marketing.tsx` → `src/components/site-header-web.tsx`
- Update imports in `src/routes/contact.tsx`, `src/routes/my-story.tsx`

Blog layout, blog routes, blog admin, blog DB — untouched.

## Build /my-story

Source: https://fanthespark.com/my-journey/my-story/

Included:
1. **Full narrative text** (~10 paragraphs) — verbatim from source
2. **Decorative `dots.png`** divider — downloaded to `src/assets/my-story/dots.png`
3. **YouTube embed** — yes, `vF_A_TcAgtM` ("My Journey - My Story"), responsive 16:9 iframe placed between the lead and the body, matching the source page's position
4. **Pull-quote** on "What is the purpose of life?"
5. **Closing CTA** → `/contact`

Structure inside web layout:
- Eyebrow "My Journey"
- H1 "My Story"
- Lead paragraph
- Dots divider
- YouTube embed (responsive)
- Body paragraphs + pull-quote
- CTA to /contact

Uses existing tokens: `--font-serif-display`, `--font-serif-body`, `--font-meta`, `--brand-gold`. No new colors.

## Not touched

Blog index, blog post pages, blog admin/editor, blog DB, RSS, tag pages, sidebar, `site-layout.tsx`, `site-header.tsx`, `/contact` content.

## Open

No portrait/hero photo exists on the source page — using clean typographic hero. Send a photo later if you want one swapped in.
