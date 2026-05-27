Make the Books & Teachings section on `/home` feel like a featured, premium showcase instead of two small covers floating in whitespace. Implement the chosen "Editorial showcase" direction.

## Changes (single file: `src/routes/home.tsx`, `BooksFeature` component, lines 657–779)

1. Section padding bumped to `120px 24px 130px`; container maxWidth raised from 920 → 1100.

2. Header restyled:
   - Eyebrow "READ" centered between two short 48px hairlines (1px lines in foreground/22%) instead of the existing `<SectionEyebrow>`.
   - Heading scaled up to `clamp(40px, 6vw, 72px)`, still italic serif display.

3. Two-up book grid (`md:grid-cols-2`), gap 64px, items aligned to top — books become the centerpiece.

4. Each book card:
   - Cover wrapper with atmospheric framing: a soft `-24px` inset panel behind the cover using `color-mix(foreground 6%, background)`.
   - Cover itself: aspect 3/4.5, deep editorial shadow `25px 25px 60px -15px rgba(20,16,8,0.22), 5px 5px 15px rgba(20,16,8,0.08)`, 1px hairline outline, `objectFit: cover`.
   - Hover: whole group lifts `-translate-y-2` over 700ms; CTA arrow nudges right 1.5.
   - Title scales to `clamp(26px, 2.4vw, 32px)`, removed forced italic (cleaner hierarchy with italic heading above).
   - Description allowed up to 220 chars (was 140) with `font-serif-body`, line-height 1.7, color foreground/78%.
   - "READ MORE →" CTA: uppercase, letter-spacing 0.22em, bold, primary color, underlined with primary/45%, arrow in a separate span that translates on hover.

5. All colors come from existing tokens (`--foreground`, `--background`, `--muted`, `--primary`, `--font-serif-display`, `--font-serif-body`, `--font-meta`) — no hardcoded hex values, palette stays locked.

6. No changes to data fetching, routing, links, or any other section.

## Technical notes
- Drops the `SectionEyebrow` usage inside this component only; everywhere else still uses it.
- Pure presentational refactor — no new imports, no new files, no dependency changes.
