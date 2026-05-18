## Goal

Snapshot the current visual design as **"style1"** and set up a system so future styles (style2, style3, …) can be previewed by passing a `?style=styleN` URL parameter on any page.

## Approach

A theme registry + a tiny React provider that reads `?style=` from the URL and swaps a set of CSS variables on `<html>`. No component rewrites — every styled element already reads from CSS variables and a small set of named font/color tokens, so switching themes = swapping variable values.

## Files to add

```
src/styles/themes/
  style1.css          ← exact snapshot of today's tokens
  index.ts            ← registry: { style1: "style1", ... }
src/components/
  theme-provider.tsx  ← reads ?style= search param, sets data-style on <html>
```

## How style1 captures "today"

`style1.css` will define a `[data-style="style1"]` block containing every token currently in use, so nothing visual changes when style1 is active (which will be the default):

- **Color tokens** (from `src/styles.css` `:root`): `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--muted`, `--muted-foreground`, `--accent`, `--border`, `--input`, `--ring`, `--destructive`, sidebar tokens, `--brand-olive` — all current oklch values.
- **Font tokens**: `--font-serif-display` (Cormorant Garamond), `--font-serif-body` (Lora), `--font-meta` (Libre Caslon Text), `--font-display-sans` (Inter Tight).
- **Radius**: `--radius`, `--radius-sm/md/lg/xl`.
- **Brand accent hexes** promoted to variables so future styles can override them:
  - `--brand-header-bg: #faf6ee`
  - `--brand-title-color: #7e6c2a`
  - `--brand-gold: #d9a74e`
  - `--brand-title-card-bg: rgba(239, 217, 180, 0.18)`
  - `--brand-header-border: rgba(217, 167, 78, 0.22)`
  - `--brand-header-shadow: rgba(126, 108, 42, 0.07)`
- **Header geometry**: `--header-height-expanded: 124px`, `--header-height-scrolled: 64px`, mobile variants, logo heights, transition `380ms cubic-bezier(0.4,0,0.2,1)`.

A small, surgical refactor will swap the hard-coded hex strings in `site-header.tsx`, `post-preview.tsx`, `post.$slug.tsx`, and `preview.$slug.tsx` to read from these variables — so style2 can rebrand without touching component code.

## How `?style=` works

`theme-provider.tsx` (mounted once inside `__root.tsx`):

1. Reads `window.location.search` for `style` (e.g. `?style=style2`).
2. Validates against the registry; falls back to `style1`.
3. Sets `document.documentElement.dataset.style = "<name>"`.
4. Re-runs on route changes via TanStack's `useRouterState`.

`styles.css` imports each theme file. Each theme is scoped to `html[data-style="styleN"] { … }` so switching is instant and SSR-safe (no flash — style1 vars are also set on `:root` as the default).

URLs after this change:
- `/` → style1 (default, unchanged)
- `/?style=style1` → explicit style1
- `/post/some-slug?style=style2` → preview style2 (once style2 is added)
- Works on every route automatically.

## Adding future styles

To add style2 later: create `src/styles/themes/style2.css` overriding any subset of variables, register it in `themes/index.ts`. No other changes needed.

## What does NOT change

- No visual difference when viewing the site today — style1 is byte-equivalent to current rendering.
- No font, layout, header animation, article-body, or title-card behavior changes.
- No backend, routing, or content changes.

## Out of scope

- Building style2/style3 (you'll request those separately).
- A UI style-switcher widget (URL param only, per your request).
- Persisting the chosen style across navigation without the URL param.

---

Shall I implement?
