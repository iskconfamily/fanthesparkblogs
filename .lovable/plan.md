
Scope: `src/routes/my-story.tsx` only. No blog files touched. No business logic changes.

### 1. Revert desktop hero to prior centered framing

In the `heroImageStyles` block:
- `@media (min-width: 1024px)` → `max-height: min(70vh, 760px)`, `object-fit: cover`, `object-position: center 18%` (the framing you approved before the recent shift).
- `@media (min-width: 1800px) and (min-aspect-ratio: 2/1)` → `max-height: 74vh`, `object-position: center 24%`.

Net effect on 16" laptop/desktop: identical to the version you said looked good earlier.

### 2. Mobile hero: center on the person, not fit-whole-image

Right now mobile uses `height: auto` (pure no-crop), which is why the hero feels small and the person is shrunk into a wide letterbox. Original site uses a taller portrait crop centered on the subject.

Add a mobile-only block (default styles, overridden at `min-width: 1024px`):
- `.my-story-hero-image` on mobile → `height: 78vh`, `min-height: 520px`, `max-height: 760px`, `object-fit: cover`, `object-position: 50% 30%` (centers on head/torso — the meditating subject).
- This makes the hero a proper tall portrait frame on phones, matching the original site's feel, with the person centered.

Title overlay stays bottom-left with the existing faint text shadow. No gradient wash added.

### 3. Tighten mobile spacing around the hero

- Lead `Prose tight="bottom"` block: reduce top padding on mobile so the intro paragraph sits closer to the hero (`pt-6 sm:pt-10` instead of the current larger top padding inside `tight="bottom"`).
- YouTube section: already `pt-2 pb-6` on mobile — keep as is.
- Body `Prose tight="top"`: already tight on mobile — keep as is.

### Files
- `src/routes/my-story.tsx` — edit `heroImageStyles` CSS and the `Prose` `tight="bottom"` mobile padding.

### Out of scope
- Desktop layout beyond the revert.
- Blog routes/components.
- Image asset itself (no new crop file).
