## Goal
The inline image in the "Advent of the Bhagavad-gita" draft is broken (the Blogger-hosted URL is hotlink-blocked, so only the alt text shows). Replace it with your attached chariot painting, placed where it best fits the narrative.

## Changes

### 1. Upload the attached image
Copy `user-uploads://bhagavadgita-6.jpg` into project storage and upload to the `blog-images` bucket as `advent-of-the-gita/chariot-inline.jpg` → returns a stable public URL.

### 2. Replace the broken inline image block
In the post's `blocks` JSONB, update the existing image block `g8`:
- `src` → new uploaded URL
- `alt` → "Krishna serving as Arjuna's charioteer on the battlefield of Kurukshetra"
- `caption` → *"Krishna becomes Arjuna's charioteer — and ours, when we are ready to hear."*
- `layout` stays `inline-small` (centered, ~60% column width)

### 3. Reposition for narrative fit
Move the image so it sits **right after the Prabhupada quote (g7)** — *"…To this end He spoke the Bhagavad-gita, making His friend Arjuna His student."* — and **before paragraph g9** ("Before hearing Bhagavad-gita…").

That spot is the article's pivot from "we are lost in nescience" to "Krsna comes as teacher" — the chariot painting visually anchors that turn.

Final order around the change:
```text
g7  quote — "swallowed by the tigress of nescience… making Arjuna His student"
g8  image — chariot painting (new)
g9  paragraph — "Before hearing Bhagavad-gita…"
g10 paragraph — "As Arjuna set aside his bow…"
```

## Note on the hero image
The current hero is also a Krishna+Arjuna chariot scene (Wikimedia). The attached painting is more vivid and detailed. Two options — I'll default to **A** unless you say otherwise:

- **A. Keep current hero, use attached image inline** (as planned above). Two different chariot artworks, hero stays calm/classical, inline adds color at the narrative pivot.
- **B. Promote the attached image to hero** and pick a non-chariot inline image (e.g. an open Gita / temple altar) so the article doesn't repeat the same scene.

## Out of scope
- Rewriting body copy.
- Changing the hero image (unless you pick option B).
- Publishing — stays a draft for your review at `/preview/advent-of-the-bhagavad-gita`.
