## Goal

Stop authoring new editorial copy on `/my-journey`. The two tiles should preview approved content that already exists on the child pages, and the tile images should be ones already used on those child pages.

## Scope

Single file: `src/routes/my-journey.index.tsx`. No changes to leaf pages, routing, hero, layout, or `ContactSection`.

## Changes

### 1. My Story tile

- **Title:** `My Story` (unchanged)
- **CTA:** `Read My Story →` (unchanged)
- **Teaser — replace** current "The questions, search, and moments that shaped a life of bhakti." **with the verbatim opening line of `/my-journey/my-story`:**

  > "When I was a child, I was deeply curious about the mystery of life."

  (13 words, appears verbatim in the first `<Para>` of `my-journey.my-story.tsx`. Rendered in quote marks to signal it is an excerpt.)
- **Image:** keep `@/assets/my-story/vaisesika-meditation.png` — already the hero image on My Story. No change.

### 2. My Guru tile

- **Title:** `My Guru` (unchanged)
- **CTA:** `Learn About My Guru →` (unchanged)
- **Teaser — replace** current "The teacher, shelter, and legacy at the heart of this journey." **with a verbatim phrase from `/my-journey/my-guru`'s intro paragraph:**

  > "The world's pre-eminent exponent of the teachings and practices of Bhakti-yoga to the Western world."

  (15 words, drawn directly from the opening `<Para>` of `my-journey.my-guru.tsx`. Rendered in quote marks.)
- **Image — swap** `@/assets/my-guru/prabhupada-portrait.jpg` (not used on My Guru) **for `@/assets/my-guru/prabhupada-hero.png`**, which is the actual hero image on the My Guru page. Update the `alt` to match: "Srila Prabhupada seated in a forest, garlanded with marigolds."

### 3. Light style touch (optional, low-risk)

In `JourneyTile`, add a subtle italic style to the teaser `<p>` so the quoted excerpt reads as a pulled quote rather than a marketing line. Single inline style change; no new components.

## Out of scope

- No edits to `my-journey.my-story.tsx` or `my-journey.my-guru.tsx`.
- No changes to hero copy, dots ornament, layout grid, or contact section.
- No new image generation.
- No changes to `/wisdom`, `/next-steps`, or `/serve`.

## Fallback

If you prefer neutral labels over excerpts, swap the two teasers for:
- My Story: "A life in bhakti-yoga."
- My Guru: "The life and legacy of Srila Prabhupada."

Default is the verbatim excerpts above unless you say otherwise.
