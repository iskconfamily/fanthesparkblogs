## Goal

On the "Our Family Business" post, the cover image currently renders huge. Shrink it to a small (~280px), floated-right thumbnail so the opening paragraphs wrap around it like a book listing.

## Why it's currently big

The post already has `imageLayout: "side"` in `src/content/posts.ts`, which the renderer maps to `side-right` (`w-[44%] max-w-[280px]`). So on the public post page it *should* already be small. The screenshot showing a giant image is coming from the database `blocks` document — at some point the AI chat designer (or the import flow) saved a `blocks` array for this post where the cover is a `hero` / `full` layout image. Since `PostArticle` prefers `post.blocks` over the legacy `body` whenever blocks are non-empty, the saved big-hero version is what's served.

## Change

One targeted fix in the database for the `our-family-business` row:

- Rewrite its `blocks` jsonb so the cover image block has `layout: "side-right"` (and is positioned right after the first paragraph, matching the legacy intent).
- Leave every other field — title, paragraphs, headings, ordering of text — untouched.

No code changes needed; the renderer already handles `side-right` correctly (`float-right ml-6 mb-3 w-[44%] max-w-[280px]`).

## Verification

After the migration:
1. Reload `/post/our-family-business` and confirm the cover sits to the right of the opening paragraphs at ~280px wide.
2. Confirm the home-page card for the same post also shows the small floated image (same blocks document is used in both places).

## Out of scope

- Adjusting other posts' image sizes.
- Touching the chat designer prompt or admin UI.
- Restyling typography / colors on the post page.
