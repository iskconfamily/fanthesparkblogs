## Goal

Refine the page headers on `/next-steps/small-groups`, `/serve/volunteer`, and `/serve/give` so each gets a modest, page-appropriate visual accent — not a heavy hero image — while staying consistent with the rest of the site (warm soft background, rounded corners, existing typography).

## Approach

Currently all three pages use `PlaceholderPage`, which renders a centered type-only hero band (eyebrow + italic serif title) on the warm header bg. We'll extend `PlaceholderPage` to accept an optional `headerAccent` prop and render an asymmetric two-column hero (text left, accent right) when provided. When `headerAccent` is omitted, behavior is unchanged (Give keeps clean type-only header).

### `src/components/placeholder-page.tsx`
- Add optional `headerAccent?: React.ReactNode` prop.
- When present, render hero as a `lg:grid-cols-[1.2fr_1fr]` layout: left column keeps left-aligned eyebrow + title; right column renders `headerAccent` inside a rounded (`borderRadius: 12`), soft warm card with the existing border. On mobile the accent stacks below.
- When absent, keep the current centered type-only hero exactly as-is.

### `src/routes/next-steps/small-groups.tsx`
- Pass a `headerAccent` showing a warm community/small-group image. Use one of the existing community-themed assets already in `src/assets/` (prefer `hero-crowd-bg` or a temple-namaste/community image; pick the warmest small-group-feeling one after a quick `ls src/assets`). Image rendered inside a rounded card with `aspect-[4/5]` or `aspect-square`, `object-cover`, soft inner border, plus a small italic caption underneath ("Kindred spirits, monthly circles") in the meta font.
- Use `?format=webp&w=900&quality=78` import suffix and `loading="eager"`, `decoding="async"` (header-visible).

### `src/routes/serve/volunteer.tsx`
- Pass a `headerAccent` rendering a 2×2 icon grid of the five service areas (collapsed to four representative ones, or 2×3 with five tiles + one accent). Each tile: rounded square card, warm header bg, 1px border, lucide-react icon centered (already a project dep) in `--brand-olive`, and a tiny uppercase meta label below. Icons: `Laptop` (Digital), `Sparkles` (Mindfulness), `Mountain` (Retreat), `BookOpen` (Books), `UtensilsCrossed` (Cooking).
- No image — purely typographic + iconographic accent so it stays subtle.

### `src/routes/serve/give.tsx`
- Do NOT pass `headerAccent`. Keep the clean type-only header so the donor-level cards below remain the visual focus. (Per request.)

## Consistency
- All accents reuse existing tokens: `var(--brand-header-bg)`, `var(--brand-header-border)`, `var(--brand-olive)`, `var(--font-meta)`, `var(--font-serif-display)`.
- Rounded corners: `borderRadius: 12` for the accent card, `8` for inner tiles — slightly softer than the rest of the site's `4` to feel like a gentle accent without breaking the system.
- Hero band keeps the same warm bg and bottom border; only the inner layout changes when an accent is present.

## Out of scope
- No copy changes to intros/body.
- No changes to the donor level cards or volunteer level cards.
- No new routes, no CMS, no design system token changes.
