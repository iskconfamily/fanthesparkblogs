# Replace middle image on /my-story with the uploaded Prabhupada photo

## What's there now
- **Hero (top):** `vaisesika-meditation.png` — keep as-is.
- **Middle full-bleed:** `vaisesika-portico.png` (Vaisesika in prayer at temple) — **replace this** with the uploaded Prabhupada photo.

## Plan
1. Copy `user-uploads://Prabhupada1-2.jpg` → `src/assets/my-story/prabhupada-with-devotees.jpg`.
2. In `src/routes/my-story.tsx`:
   - Replace import `templeNamaste` with the new asset.
   - Update the full-bleed `<section>` (lines 275–287) to use the new image.
   - Update `alt` to "Srila Prabhupada with devotees".
   - Adjust `object-position` to keep Prabhupada centered (likely `center 35%` since he sits in the upper-middle of the frame).
3. Leave hero, copy, YouTube embed, and closing CTA untouched.

Approve and I'll ship.
