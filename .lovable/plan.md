## Scope
Small mobile UX fix for `/blog2/:slug` individual post layout (PostMinimal component).

## Changes
1. **PostMinimal title sizing**: Change from `text-5xl md:text-6xl` to `text-3xl md:text-6xl` so the large serif italic title fits comfortably on mobile.
2. **PostMinimal card padding**: Reduce horizontal padding slightly on mobile from `px-6 md:px-16` to `px-5 md:px-16` to reclaim a bit of horizontal breathing room.

## Files affected
- `src/components/blog-layouts/PostMinimal.tsx`

## Out of scope
- No changes to /blog, /blog3, or /post routes
- No email template work
- No color, typography, or layout changes beyond mobile sizing

## Verification
- Screenshot `/blog2/faq-bhakti` at 390×844 after fix
- Confirm title renders at 3xl, comfortable reading, no overflow
- Confirm desktop unchanged (6xl, px-16)