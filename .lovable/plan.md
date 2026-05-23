
Scope: `src/routes/my-story.tsx` only. No desktop, blog, or image-asset changes.

### 1. Mobile hero — 4:5 portrait crop

In `heroImageStyles`, mobile default rule becomes:
```
aspect-ratio: 4 / 5;
height: auto;
max-height: 560px;
object-fit: cover;
object-position: 52% 32%;
```
Effect on 390px phone: ~488px tall (between prod ~220px and current preview ~660px). Subject centered on head/torso. Title overlay stays inside image bottom-left.

Desktop `min-width: 1024px` and `1800px` rules unchanged.

### 2. Tighten gap between hero and intro paragraph

- Lead `Prose tight="bottom"` block: `pt-4 sm:pt-10` (less top padding on mobile).
- `<Dots />`: change `my-10` → `my-6 sm:my-10`.

### Files
- `src/routes/my-story.tsx`
