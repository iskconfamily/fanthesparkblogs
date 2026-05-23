# Fix: hub pages eating their child routes

## Problem

In TanStack Router's flat-route convention, a file like `my-journey.tsx` that has sibling children (`my-journey.my-guru.tsx`, `my-journey.my-story.tsx`) is treated as a **layout route** for the entire `/my-journey/*` subtree. Layout routes MUST render `<Outlet />` for children to appear.

Our current hub files (`my-journey.tsx`, `wisdom.tsx`, `next-steps.tsx`, `serve.tsx`) render `<HubPage>` with no `<Outlet />`. Result: visiting `/my-journey/my-guru` matches the child route, but the parent paints the My Journey hub and the child has no slot — so the user sees the hub everywhere under `/my-journey/*`. The fully-designed My Guru and My Story pages are hidden.

## Fix

Convert each hub from a layout route into a plain index route by renaming:

- `src/routes/my-journey.tsx` → `src/routes/my-journey.index.tsx`
- `src/routes/wisdom.tsx` → `src/routes/wisdom.index.tsx`
- `src/routes/next-steps.tsx` → `src/routes/next-steps.index.tsx`
- `src/routes/serve.tsx` → `src/routes/serve.index.tsx`

Inside each renamed file, update the route declaration:

```ts
createFileRoute("/my-journey/")({ ... })   // was "/my-journey"
createFileRoute("/wisdom/")({ ... })
createFileRoute("/next-steps/")({ ... })
createFileRoute("/serve/")({ ... })
```

No component changes — the HubPage content stays exactly as-is. Now `/my-journey` renders only the hub; `/my-journey/my-guru` and `/my-journey/my-story` render their own dedicated pages (the fully-designed Guru / Story pages that already exist).

`wisdom.blog.tsx` + `wisdom.blog.$slug.tsx` are unaffected (no `wisdom.blog.index.tsx` needed — the slug list is at `/wisdom/blog` and that file already declares `/wisdom/blog`).

## Out of scope

- No changes to the hub designs, child page designs, headers, contact section, or navigation.
- The "Failed to load /src/routes/my-story.tsx" runtime warning is stale HMR; it will clear on the next clean build once `routeTree.gen.ts` regenerates from the renames.
- LastPass-related hydration warning is a browser extension artifact, not our code.

## Verification

After rename, the auto-generated `src/routeTree.gen.ts` will recreate the entries with the hubs as index routes rather than layout routes. Visit `/my-journey/my-guru` → renders the Srila Prabhupada page. Visit `/my-journey` → renders the hub with two cards.
