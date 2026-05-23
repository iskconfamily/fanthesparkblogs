## Plan: Fix image cropping on My Journey hub

### Problem
The My Story tile image (`vaisesika-meditation.png`) is being cropped by `object-fit: cover` with the default `object-position: center center`, which cuts off the person in the frame.

### Solution
Add an optional `imagePosition` prop to the `JourneyTile` component so the My Story tile can receive `objectPosition: "30% 35%"` (shifting the focal point left-of-center and slightly above center) while the My Guru tile keeps the default center-center crop.

### Changes
1. In `src/routes/my-journey.index.tsx`:
   - Add optional `imagePosition?: string` to `TileProps`
   - Apply it as `style={{ objectPosition: imagePosition }}` on the `<img>` inside `JourneyTile`
   - Pass `imagePosition="30% 35%"` on the `<JourneyTile>` instance for My Story

No other files touched.