## Goal
Make the signature image at the end of the "Appreciation" post render much smaller (roughly its natural ~300px width) instead of stretching to the full article column.

## Change
In `src/components/post-article.tsx`, inside `legacyToBlocks`, detect signature figures and emit them as `inline-small` (with a tighter cap) instead of `full`.

Detection rule: figure block whose `src` contains `/appreciation/signature` OR whose `alt` starts with "Signature". This keeps the rule narrow so normal inline figures stay full-width.

For these signature blocks:
- `layout: "inline-small"`
- no caption (the "Vaisesika Dasa" line below already serves as the label)

If `inline-small` in `article-body.tsx` is still wider than the signature looks good at (~320px), add a small style override for `alt^="Signature"` images so they max out around 280–320px and stay left-aligned (matches the screenshot's natural placement).

## Out of scope
- Changing the signature image file itself
- Touching other posts' image rendering
- Any DB changes — the markdown in `content` stays as-is