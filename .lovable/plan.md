## Goal

Revert the hero to the original full-width layout: crowd silhouette stretches edge-to-edge with the stamp at natural proportion on top. Keep current fonts and alternating CTA colors.

## Changes — `src/routes/home.tsx` Hero only

1. **Background stretches full width again**
   - `backgroundSize: "min(780px, 78%) auto"` → `backgroundSize: "100% auto"` (crowd silhouette bleeds to both edges, stamp scales with viewport — same as the original site).
   - Keep `backgroundPosition: center top`, `backgroundRepeat: no-repeat`, `backgroundColor: #f2f0ea`.

2. **Restore content clearance**
   - `paddingTop: clamp(220px, 26vw, 360px)` → `clamp(280px, 34vw, 440px)` so the welcome text starts below the stamp at all widths.
   - `paddingBottom: 120` → `100`.

3. **No changes to**
   - Eyebrow placement, font, color
   - Welcome paragraph styling/copy
   - CTA pair (filled orange + ghost outline alternating)
   - Any other section

## Out of scope

No copy, color, or section changes outside the Hero background sizing and padding.
