## Header refinement — horizontal logo + wordmark lockup

### Problem
Current header stacks logo above "Fan The Spark" in bold Inter Tight. The heavy sans-serif title clashes with the literary serif feel of the rest of the site (article titles in Cormorant Garamond italic, Lora body).

### Change — `src/components/site-header.tsx`
Replace the stacked, centered, sans-serif layout with a **horizontal lockup**:

- Container: flex row, items-center, justify-center, gap-4
- Logo: ~60px (h-15 w-15), unchanged image
- Title beside logo: **"Fan The Spark"** in
  - `var(--font-serif-display)` (Cormorant Garamond)
  - `fontWeight: 500`, upright (not italic)
  - `text-4xl md:text-5xl`
  - default foreground color (deep charcoal) — lets the orange logo provide the brand pop without competing
  - tracking-tight

Wrap in `<Link to="/">` exactly as today.

### Keep as-is
- Border, padding (`pt-12 pb-6`), max-width
- No tagline (already removed)
- Sandstone primary color and all other tokens
- `--font-display-sans` token can stay in styles.css (unused, harmless) or be removed — minor cleanup

### Files touched
- `src/components/site-header.tsx` (only)

### Also worth doing in the same pass (small fix)
The runtime hydration warning is caused by a browser extension (LastPass) injecting into the newsletter form input — not actionable in code. Ignore.
