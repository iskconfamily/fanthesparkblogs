## Goal

Fix two things on the "Want to change Stress to Serenity?" post:
1. Make the second image actually prominent, not a small floated thumbnail.
2. Unpublish it so you can review/edit before it goes live.

## Changes

### 1. Make it a draft
Update the `blog_posts` row for slug `want-to-change-stress-to-serenity`:
- `status` → `draft`
- `published_at` → `NULL`

Result: it disappears from the public site and homepage, but is fully visible/editable in `/admin` and previewable at `/preview/want-to-change-stress-to-serenity`.

### 2. Use the second image properly

Currently the lotus/mind image is `layout: "side-right"` (small float). I'll change it to a larger centered placement so both images read as real images, not decoration:

- **Image 1 (hero)** — meditation silhouette at sunrise → stays as the featured/hero image at the top.
- **Image 2 (lotus mind)** — change `layout` from `side-right` to `inline-small` (centered, ~60% column width) and move it between the "vrittis" paragraph and the Epictetus quote, with a short caption like *"A calm mind: the goal of mantra meditation."*

This is a targeted JSONB edit to that one row — no schema or code changes.

## Review flow

After the update:
1. Open `/admin` → post shows with a **draft** badge.
2. Click **Preview** to see the layout exactly as readers will.
3. Click **Design with AI** or **Edit** to tweak text/images further.
4. When happy, click **Publish** in the admin list.

## Out of scope
- Re-generating the images (keeping the two we already have).
- Changing the default behavior of new posts created from the admin (those already default to draft).
