## Goal

Make `params.blog_html` look like the website's `ArticleBody`, so any Brevo template that drops `{{ params.blog_html }}` inside its own header/footer renders content that matches fanthesparkblogs.lovable.app.

Chrome (logo, header, footer, outer container, background) stays in the Brevo template — `blog_html` remains inner-content-only.

## What changes

Single file: `src/lib/email-html.ts`. Rewrite the inline style constants and a few block renderers so they mirror `src/styles.css` tokens and `src/components/article-body.tsx`.

No changes to `email.functions.ts`, the editor UI, or the send flow.

## Style mapping (CSS variables → inlined email values)

Resolve CSS variables/Tailwind to concrete hex + web-safe font stacks (email clients can't read OKLCH or var()):

| Token | Site value | Email inline value |
|---|---|---|
| `--font-serif-body` | Libre Baskerville | `"Libre Baskerville", Georgia, "Times New Roman", serif` |
| `--font-serif-display` | Cormorant Garamond | `"Cormorant Garamond", Georgia, "Times New Roman", serif` |
| `--font-meta` | Libre Caslon Text | `"Libre Caslon Text", Georgia, serif` |
| `--background` (paper) | oklch(0.985 0.006 85) | `#fbf8f1` |
| `--foreground` (olive) | oklch(0.42 0.07 95) | `#7e6c2a` |
| `--primary` (sandstone) | oklch(0.687 0.176 42) | `#f2673a` |
| `--muted` | oklch(0.91 0.022 80) | `#e8e1d2` |
| `--muted-foreground` | oklch(0.45 0.025 55) | `#7a6a55` |
| `--border` (soft tan) | oklch(0.82 0.03 75) | `#d4c8b0` |
| Body text color | inherits foreground @ ~85% | `#5e5022` |

Body type size/leading from `ArticleBody`: `text-[18px] leading-[1.75]`.

## Per-block rewrite (matching `ArticleBody`)

- **paragraph** — `font:18px/1.75 var(--font-serif-body)`, color `#5e5022`, margin `0 0 18px`.
- **heading h2/h3** — `var(--font-serif-display)`, italic, h2 `30px/1.25`, h3 `24px/1.3`, color `#7e6c2a`, top margins `48px`/`40px` to match `mt-12`/`mt-10`.
- **quote** — left border `2px solid #f2673a` (primary), padding-left `24px`, display font italic `24px/1.5`, color `rgba(126,108,42,0.85)`. Cite: meta font, uppercase, `letter-spacing:0.18em`, `12px`, muted.
- **pull-quote** — centered, max-width `640px`, display font italic, `32px/1.3` (mobile-safe; site uses 3xl/4xl), color `#7e6c2a`. Cite: meta font, uppercase, `letter-spacing:0.22em`, `11px`.
- **image / image-text / gallery** — keep current `display:block;width:100%`. Caption uses display font italic `13px`, color `#7a6a55`, center under hero, left under side-by-side.
- **divider** — `border-top:1px solid #d4c8b0`, margin `48px 0`.
- **callout** — `border-left:4px solid #f2673a`, background `#f4ede0` (slight muted paper), body font `16px/1.65`, color `#5e5022`.
- **newsletter-cta** — keep skipped in email.
- **excerpt lead** (already prepended) — display font italic `20px/1.55`, color `#7e6c2a`.
- **featured image** — unchanged behavior.

## Inline links

Inline `<a>` color switches from current `#8a5a2b` to `#f2673a` (primary), with `text-decoration:underline`. Bold/em unchanged.

## Optional Google Font import for clients that allow it

Prepend a single `<link>`-equivalent `<style>` block at the top of `blog_html` that `@import`s the three Google fonts (Cormorant Garamond, Libre Baskerville, Libre Caslon Text). Gmail strips it but Apple Mail / many web clients honor it — when stripped, the Georgia/Times fallback in each stack keeps the literary feel. This is the only way to actually load the site's webfonts in email.

```text
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Caslon+Text:ital,wght@0,400;1,400&display=swap');
</style>
```

## Out of scope

- No header/footer/outer wrapper in `blog_html` (your Brevo template owns chrome).
- No changes to the params object shape, send flow, template/list selection, or debug panel.
- No on-site visual changes.

## Verification

After the edit, open the editor's existing blog_html preview panel — confirm the first 300 chars include the new font stacks and primary `#f2673a` accents. Send a test email to confirm rendering parity in Gmail and Apple Mail.
