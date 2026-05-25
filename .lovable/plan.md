## Plan

Two small, scoped changes to the combined Transformational Stories + testimonials section on `/home`.

### 1. Generate a new custom image for Transformational Stories

Replace the current `postServe` photo with a freshly generated, on-brand image that better evokes inner transformation.

- Generate via `imagegen--generate_image` (standard tier) at 1600×1200, saved to `src/assets/transformational-stories.jpg`.
- Prompt direction: a soft, cinematic, documentary-style photo — warm natural light, a contemplative human moment connected to service (e.g. hands gently holding a small flame/diya, or a quiet figure at sunrise on a path). Muted, editorial palette aligned with the site's cream/orange/serif aesthetic. No text, no logos, shallow depth of field.
- Swap the `import` in `src/routes/home.tsx` from `postServe` to the new asset and update the `<img src>` and `alt` accordingly.

### 2. Rename the testimonials heading

In `src/routes/home.tsx`, change the section label from **"Kind Words"** to **"Voices from the Journey"**. Keep the existing eyebrow styling (uppercase serif, letter-spaced) — only the text changes. No other layout/structure changes.

### Also (housekeeping, unrelated to user ask)

While in `src/routes/home.tsx`, fix the lingering runtime error `TESTIMONIALS is not defined` by ensuring `TESTIMONIALS` is correctly imported from `@/components/testimonials-row` (or inlined). This is required for the page to render at all.

### Files touched

- `src/assets/transformational-stories.jpg` (new, generated)
- `src/routes/home.tsx` (image import + heading text + import fix)

No other components, routes, or pages are affected.
