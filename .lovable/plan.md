## Goal

Match the `/home` hero to the current fanthespark.com hero: same light background image (the FTS logo stamp on the crowd-with-hands-raised plate) and same two CTAs.

## Changes (single file: `src/routes/home.tsx`, `Hero` component only)

### Background image
- Copy the uploaded `FTS_LogoStamp_WithBackground-01-4.png` into `src/assets/hero-stamp-background.png` and import it.
- Replace the current full-bleed dark `prabhupada-with-devotees.jpg` + dark gradient overlay with this light stamp image as the hero background.
- Use `background-color: #f2f0ea` (matches the light cream of the current site) behind it; image positioned `center top`, `object-fit: cover` on desktop, with enough height to show the stamp + the soft crowd silhouette below.
- Remove the separate `<img src={stamp}>` mark and the dark `linear-gradient` overlay — the stamp is part of the background image itself on the live site.

### Copy (kept from approved welcome text)
- Keep the existing approved welcome paragraph: "Welcome to the Fan The Spark website where you will find encouragement and support for expanding your book distribution, sadhana, and understanding of sastra. Click the links below to learn more."
- Drop the large invented italic headline ("Welcome to the Fan The Spark website.") — the current site has no large H1; the welcome text itself sits beneath the stamp. Keep an `<h1>` for SEO but make it visually the welcome paragraph (or `sr-only` an H1 and render the welcome as a centered paragraph). Use the latter to match the live site exactly.
- Remove the small "Fan The Spark · with Vaisesika Dasa" kicker — not present on the live hero.

### CTAs (match live site)
Replace the current "Read the blog" / "My story" buttons with the live-site pair:
1. **Lord Chaitanya** → `/wisdom/lord`
2. **Disciple of Srila Prabhupada** → `/my-journey/my-guru`

Style them as solid orange/primary buttons (matching the live site's filled orange CTA look) using the existing `--primary` / brand-gold tokens; uppercase, generous padding, side-by-side.

### Layout
- Hero becomes a centered, light-themed section (not the dark full-bleed treatment). Stamp background fills the section; welcome text + 2 CTAs centered beneath.
- Text color switches from cream (`#f8f1df`) to dark (`var(--foreground)`) for contrast against the light background.

## Out of scope
- No changes to any other section (Start Here, My Journey, Wisdom & Teachings, Service, Stories).
- No routing/nav/menu changes.
- The dark `prabhupada-with-devotees.jpg` asset stays in the repo (still used on `/my-journey/my-story`).