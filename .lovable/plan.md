## Issue

The small avatar shown next to "VAISESIKA DASA · MAY 19, 2026" in blog post bylines uses `src/assets/vaisesika-portrait.png` — a separate file from the home page portrait (`vaisesika-dasa-portrait.jpg`) that was updated last turn. That's why the old picture still shows.

## Fix

Overwrite `src/assets/vaisesika-portrait.png` with the newly uploaded `Vaiseika-dasa-3.jpg` so the byline avatar (used across every blog post via `src/components/byline.tsx`) picks up the new headshot.

No code changes needed — the import path stays the same; only the binary asset is replaced.

## Scope

- Replace: `src/assets/vaisesika-portrait.png` ← `user-uploads://Vaiseika-dasa-3.jpg`
- No edits to `byline.tsx`, `home.tsx`, or any other file.
