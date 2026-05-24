## Goal

Keep the "FAN THE SPARK" eyebrow, but position it below the stamp/crowd background image and sit it tight above the welcome paragraph (acts as a small section label introducing the text).

## Changes — `src/routes/home.tsx` (Hero only)

1. **Keep eyebrow** — do not delete it.
2. **Reposition** — render the eyebrow as the first item in the centered content column (right after the `paddingTop` clearance that pushes content below the stamp image). Order becomes:
   - Eyebrow "FAN THE SPARK"
   - Welcome paragraph
   - CTA row
3. **Tighten spacing** — eyebrow `margin: 0 auto 12px` (was implicit/larger) so it hugs the paragraph below it. Paragraph keeps existing `margin: 0 auto 40px` to CTAs.
4. **Styling unchanged** — eyebrow remains uppercase, `letter-spacing: 0.28em`, `12px`, color `#c2542a`, `var(--font-meta)`, centered.

## Out of scope

No changes to background image, layout width, CTA styling, copy, or other sections.
