## New page: `/my-guru`

A biographical page about Srila Prabhupada, designed in the same editorial language as `/my-story` (cream background, serif body, dotted dividers, full-bleed photography, reusable `ContactSection` at the foot).

### 1. Assets

Copy all 7 uploaded photos into `src/assets/my-guru/`:
- `prabhupada-hero.png`           ← `Prabhupada7-2.png` (forest, garland — hero)
- `prabhupada-laughing.png`       ← `Prabhupada3-2.png` (with disciples, smiling)
- `prabhupada-darshan.jpg`        ← `Prabhupada1-3.jpg` (seated, rose petals, audience)
- `prabhupada-portrait.jpg`       ← `prabhupada1-672x372-2.jpg` (close portrait)
- `prabhupada-speaking.jpg`       ← `prabhupad_4-2.jpg` (orange garland, speaking)
- `prabhupada-initiation.jpg`     ← `prabhupad-2-2.jpg` (large group, giving beads)
- `prabhupada-srila-card.png`     ← `Prabhuapda5-2.png` (orange "SRILA PRABHUPADA" card)

Reuse `src/assets/my-story/dots.png` for the three-dot dividers.

### 2. Route: `src/routes/my-guru.tsx`

`createFileRoute("/my-guru")` with `head()` meta (title, description, og:title, og:description, og:image → hero). Wraps content in `SiteLayoutWeb`.

Layout sequence (mobile-first, matches /my-story rhythm):

1. **Hero band** — full-bleed `prabhupada-hero.png` on dark backdrop, bottom-left overlay:
   - eyebrow `MY JOURNEY` (uppercase tracked)
   - large italic display `My Guru`
   - small caption `His Divine Grace A. C. Bhaktivedanta Swami Prabhupada · 1896–1977`
2. **Lead prose** (`Prose` / `Para` helpers, same typography as /my-story) — dots divider, then opening paragraph about Prabhupada being the pre-eminent exponent of Bhakti-yoga and Founder-Acarya of ISKCON (link "Founder-Acarya" → `http://www.founderacharya.com/`, link "International Society for Krishna Consciousness" plain text).
3. **Para** — "Born Abhay Charan De…" through "set off on his mission to the West."
4. **Pull quote** (italic display, centered, like /my-story):
   > "Bring the teachings of Krishna to the English-speaking world."
   small caption: — Srila Bhaktisiddhanta Sarasvati to young Abhay
5. **Para** — "Having since been awarded the honorary title of Bhaktivedanta…" (cargo-ship passage).
6. **Full-bleed photo** — `prabhupada-speaking.jpg` (max-height ~80vh, object-position center).
7. **Para** — "In New York he faced great hardships…" (Bowery, Tompkins Square, founding ISKCON July 1966).
8. **Two-up photo row** (desktop: two columns; mobile: stacked) — `prabhupada-laughing.png` + `prabhupada-darshan.jpg`, each with subtle caption.
9. **Para** — "Having begun initiating his American followers…" (San Francisco, Summer of Love, "Srila Prabhupada" name).
10. **Para** — "In the eleven years that followed…" (14 times around globe, temples worldwide, Vrindavana, Mayapur).
11. **Full-bleed photo** — `prabhupada-initiation.jpg`.
12. **Para** — "Perhaps Srila Prabhupada's most significant contribution is his books…" (70+ volumes, 76 languages, BG As It Is, Srimad-Bhagavatam, Caitanya-caritamrita).
13. **Para** — "For millennia the teachings of Bhakti-yoga had been concealed…" (closing reflection).
14. **Closing line** — "A. C. Bhaktivedanta Swami Prabhupada passed away on November 14, 1977, in the holy town of Vrindaban, surrounded by his loving disciples who carry on his mission today." Render slightly larger / italic display as a soft sign-off, followed by a final dots divider.
15. **ContactSection** — `<ContactSection defaultCategory="Wisdom: Dhamesvara Mahaprabhu" />` (or default category) at the foot.

The `prabhupada-portrait.jpg` and `prabhupada-srila-card.png` are kept in assets but not all used in the initial layout — they're available for future tweaks; if room remains, the orange-card image becomes a small inline aside next to the opening lead paragraph.

### 3. Wording fidelity

All body text matches the old site verbatim (including the "all-attactive" original typo → fix to "all-attractive"). Em-dashes and curly quotes preserved.

### 4. Reuse / shared components

- Reuses `SiteLayoutWeb`, `ContactSection`, and the `Para`/`Prose`/`Dots` helper pattern from `/my-story`. To avoid duplication I'll extract `Prose`, `Para`, and `Dots` into a small shared module `src/components/editorial.tsx` and import from both `/my-story` and `/my-guru`. This is a pure refactor — no visual change to /my-story.

### 5. SEO

`head()`:
- title: `My Guru — Srila Prabhupada · Fan The Spark`
- description: ~155 chars on Prabhupada bringing Bhakti-yoga to the West, founding ISKCON, his books and legacy.
- og:image: hero photo.

### Out of scope

- Adding /my-guru to header navigation (can wire it after page approval).
- Image-gallery / lightbox interactions.
- Animation beyond the existing site's static feel.
