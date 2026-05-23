## Adjust mobile hero crop on /my-story

The subject's lap/hands are getting clipped at the bottom of the mobile hero. Shift the crop down so more of the lower body is visible.

### Change

In `src/routes/my-story.tsx`, update the mobile `heroImageStyles`:

- `object-position: 62% 32%` → `object-position: 62% 50%`

Y% goes from 32% (image pulled up, showing more sky/top) to 50% (centered vertically, showing the full seated pose). X% stays at 62% so horizontal framing is unchanged.

Desktop rules (`min-width: 1024px` and `1800px`) stay untouched.

No other files affected.