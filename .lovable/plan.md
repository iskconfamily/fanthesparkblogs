## Plan: Tighten the pre-scroll header

### Observation
When not scrolled, the logo lockup ("Fan The Spark" wordmark + deity stamp) renders at 64px tall, which makes the wordmark very wide and pushes the nav into a cramped two-line wrap. Once scrolled, the logo shrinks to 40px and the nav breathes — that state already looks right.

### Change
In `src/components/site-header-web.tsx`:
- Reduce the non-scrolled logo height from `64` → `52` (keeps presence, frees ~30–40px of horizontal room).
- Reduce the non-scrolled header height from `96` → `84` so the band stays proportional to the smaller logo.
- Leave scrolled values (`40` / `64`) untouched.
- Leave nav spacing and `whitespace-nowrap` from the previous turn in place — two-line wrap is acceptable per the user.

No other files touched.