## Header title — small-caps serif in olive

### Change — `src/components/site-header.tsx` (h1 only)
- Text stays "Fan The Spark"
- Add `font-variant: small-caps` so F/T/S render full-height and the rest as small caps (matches reference)
- Font: Cormorant Garamond (`var(--font-serif-display)`), weight **600**
- Size: `text-3xl md:text-4xl` (small caps read larger, so step down one)
- Letter-spacing: `0.08em`
- Color: **Olive Green `#7e6c2a`**

### Change — `src/styles.css`
- Add token `--brand-olive: oklch(0.52 0.07 95);` (≈ `#7e6c2a`)

### Out of scope
Logo, layout, link wrapper, padding, body/article/footer styles, primary color — all unchanged.
