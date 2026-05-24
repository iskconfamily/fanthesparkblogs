## Goal
Balance the two hero CTAs on mobile so they read as equally important.

## Approach
Match widths rather than resizing text. Two reasons:
- Shrinking "Disciple of Srila Prabhupada" or enlarging "Lord Chaitanya" would break the equal-weight rule we just established.
- Equal-width pill buttons stacked on mobile is the standard pattern and keeps typography consistent.

## Change
In `src/routes/home.tsx` → hero CTA row + `HeroCTA`:

- On mobile: stack the two CTAs vertically, both full-width within a shared max-width column (~300px), centered. Both buttons share identical width and padding.
- On desktop (≥640px): keep them side-by-side at their natural widths, as today.
- Keep "Disciple of Srila Prabhupada" on one line on desktop (`whiteSpace: nowrap`). On mobile it may wrap to two lines inside the equal-width button — that's fine because Lord Chaitanya sits in the same-width box.
- Keep all other styling unchanged: cream bg, orange border, orange text, hover → solid orange.

### Technical details
- Wrap the CTA row: `flex flex-col w-full max-w-[300px] mx-auto gap-3 sm:flex-row sm:max-w-none sm:w-auto sm:gap-4`.
- Add `w-full sm:w-auto text-center` to each `HeroCTA`.
- Add `whiteSpace: "nowrap"` to the desktop style only via a `sm:whitespace-nowrap` class (or apply unconditionally — it only matters on desktop since mobile is full-width).

## Out of scope
Font sizes, button heights, emblem, background, copy.