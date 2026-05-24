## Goal

Shrink the stamp/crowd background so the eyebrow naturally separates from the image, and fix the "stranded" look of the CTAs.

## Changes — `src/routes/home.tsx` Hero only

1. **Shrink background image**
   - `backgroundSize: "100% auto"` → `backgroundSize: "min(780px, 78%) auto"` (caps stamp width ~780px, scales down on narrow screens). Matches the original site's smaller, contained stamp.
   - Reduce `paddingTop` from `clamp(280px, 36vw, 460px)` → `clamp(220px, 26vw, 360px)` so content starts higher (image is now smaller, less clearance needed).
   - Natural gap between stamp bottom and eyebrow appears automatically.

2. **Fix CTA "stranded" feel**
   - Increase `paddingBottom` from `80` → `120` so CTAs have more breathing room within the same background band.
   - Bump `marginBottom` on welcome paragraph from `40` → `32` so CTAs sit slightly closer to the text (tighter visual group).
   - This keeps CTAs inside the silhouette band rather than dropped onto plain cream below it.

## Out of scope

No copy changes, no CTA color/style changes, no other sections touched.
