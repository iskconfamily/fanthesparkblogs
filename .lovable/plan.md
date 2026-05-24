Adjust homepage hero cream overlay opacity to let the raised-hands/kirtan crowd background show through more clearly, matching the original FanTheSpark.com devotional atmosphere.

## What
- Reduce the cream overlay opacity from `0.55` to `0.25` in `src/routes/home.tsx`.
- Keep everything else identical: emblem size, centered layout, welcome copy, subtle outline CTAs, background positioning.
- If text readability suffers after the change, add a soft top-down cream gradient behind the text block only (not a global overlay).

## Why
The current hero at opacity 1.55 washes out the crowd background almost completely. The original site shows the crowd as a soft gray silhouette across the full bottom edge, creating emotional devotional atmosphere. Lowering opacity to 1.25 will reveal the crowd while keeping the orange emblem as the focal point and maintaining text readability.

## Files touched
- `src/routes/home.tsx` — single opacity value change, plus optional text-block gradient if needed.