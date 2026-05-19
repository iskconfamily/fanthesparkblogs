## Goal

Stop fixing email/website parity one image type at a time. Apply two general rules in `src/lib/email-html.ts` that cover signatures *and* any other small/decorative images in future posts.

## Rule 1 — Mirror the site's signature detection (generic)

`ArticleBody` has one rule that catches every signature image in every post:

```ts
const isSignature = /\/signature/i.test(b.src) || /^signature/i.test(b.alt ?? "");
```

Add the same check at the top of the `case "image"` branch in `blockToHtml`. When true, render a fixed 180px figure regardless of `layout` or `caption`. This is not a one-post patch — it's the exact same predicate the site uses, so every current and future signature in any blog post renders identically in email.

## Rule 2 — Never upscale images beyond their natural size (broad safety net)

Today the default full-width image style is `width:100%;max-width:100%`. That forces small assets (icons, badges, stamps, hand-drawn marks, transparent PNGs) to stretch edge-to-edge in the email — far larger than they appear on the site, where Tailwind's `w-full` is bounded by the article column.

Change the default `IMG` style to `width:auto;max-width:100%;height:auto;`. Result:
- Large hero/full images still fill the column (their natural width exceeds the column).
- Small images render at their intrinsic size, centered in their figure — matching site behavior for anything that isn't a deliberate full-bleed photo.

Apply the same `width:auto;max-width:100%` to the `inline-small`, `side-left`, `side-right`, and gallery branches so none of them upscale.

## Why this is a "general" fix, not a one-off

- Rule 1 = same source-of-truth predicate as the site renderer. Any post that uses `/signature*` filenames (the project's convention) automatically gets the right size in email — no per-post work.
- Rule 2 = removes the entire class of "tiny image looks huge in email" bugs by aligning email image sizing with how browsers naturally render `<img>` inside a constrained container. No future image type needs a special case.

## Files touched

- `src/lib/email-html.ts` only.

## Out of scope

No changes to the website, params shape, send flow, or other templates.
