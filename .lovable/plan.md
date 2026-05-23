# Redesign `/my-journey` as an editorial hub

Turn the hub from a generic three-up card grid into an intentional editorial landing for the two leaf pages (`/my-journey/my-story`, `/my-journey/my-guru`). Set the pattern that `/wisdom`, `/next-steps`, `/serve` will later follow.

## Scope

- Edit only `src/routes/my-journey.index.tsx`.
- Reuse existing images — no new assets, no generation.
- No changes to routing, header nav, leaf pages, contact section, or the `HubPage` shared component (it stays for the other hubs until they're individually upgraded).

## New page structure

### 1. Hero — tight type, no image

- Cream band, but ~40% shorter than the current `HubPage` hero (no more vast empty space).
- Eyebrow: `MY JOURNEY` (existing meta style, olive, tracked uppercase).
- H1: italic display serif "My Journey" (existing brand type).
- Below H1, a 2-line editorial **third-person** subhead, not a centered floating sentence. Set on a constrained measure (~560px), still centered, voice matching the leaves.

  Draft copy (third person, neutral editorial — not first person):

  > Two threads run through the life of Vaisesika Dasa — the personal search that brought him to bhakti as a teenager, and the teacher whose shelter shaped every step that followed.

- Dots ornament beneath the subhead (matches `/my-story` rhythm), then the page breathes into the tiles.

### 2. Two image-led tiles — centered two-column

- Layout: `grid-cols-1 md:grid-cols-2`, max-width ~960px, generously gapped (~32–40px). No phantom third column.
- Each tile is a full-bleed image-on-top, text-below editorial card (not a bordered box with just text):
  - Image: ~4:5 aspect, full tile width, subtle bottom shadow / no harsh border.
  - Below image: italic display-serif title, then a single warm teaser line, then a text-link CTA with arrow.
- No "EXPLORE" eyebrow.

  **Tile 1 — My Story**
  - Image: `vaisesika-meditation.png` (same forest image as the `/my-story` hero, so the hub previews the leaf).
  - Title: *My Story*
  - Teaser: "The questions, search, and moments that shaped a life of bhakti."
  - CTA: `Read My Story →` (links to `/my-journey/my-story`)

  **Tile 2 — My Guru**
  - Image: `prabhupada-portrait.jpg` (calmer than the dancing hero — reads at tile scale).
  - Title: *My Guru*
  - Teaser: "The teacher, shelter, and legacy at the heart of this journey."
  - CTA: `Learn About My Guru →` (links to `/my-journey/my-guru`)

- Whole tile is clickable (`<Link>` wrapping image + text), CTA is a visual cue inside.
- Hover: subtle image scale (~1.02) and CTA arrow slide-right. No card-lift, no shadow pop — keep the editorial restraint of the rest of the site.

### 3. Contact section

- Keep `ContactSection` at the foot exactly as it appears now (consistent with every other page).

## Implementation notes

- File: `src/routes/my-journey.index.tsx` rewritten inline (no longer uses `HubPage`).
- Uses existing tokens (`--font-serif-display`, `--font-serif-body`, `--font-meta`, `--brand-olive`, `--brand-title-color`, `--brand-header-bg`, `--brand-header-border`) — no new CSS variables, no custom hex.
- `head()` metadata stays as-is (title, description, og:title, og:description, canonical for `/my-journey`).
- `HubPage` / `PlaceholderPage` in `src/components/placeholder-page.tsx` are NOT removed — `/wisdom`, `/next-steps`, `/serve` still use them. They'll be upgraded to the same editorial pattern in a follow-up turn.

## Out of scope

- `/wisdom`, `/next-steps`, `/serve` redesigns (same pattern will be applied in a follow-up turn after this hub is approved).
- Leaf page edits (`/my-journey/my-story`, `/my-journey/my-guru`).
- Header nav, dropdowns, mobile menu.
- Any new image generation or asset additions.
