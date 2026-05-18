## Goal

Create a new published blog post in the database from the source article:
`https://fanthespark.com/wisdom/blog/want-to-change-stress-to-serenity-read-this/`
— "Want to change Stress to Serenity? Read this." by Vaisesika Dasa.

Generate two original images that fit the article (mind/meditation theme) and place them inline.

## Content

- **Title**: Want to change Stress to Serenity? Read this.
- **Slug**: `want-to-change-stress-to-serenity`
- **Author**: Vaisesika Dasa
- **Category**: Bhakti Notes
- **Tags**: meditation, mantra, stress, mindfulness, yoga sutras
- **Excerpt**: A disturbed mind brings anxiety. Mantra meditation runs like an antivirus program for the mind — clearing the noise so inner peace can surface.
- **Body**: The 7 paragraphs from the source article (verbatim, lightly cleaned), with the Epictetus line pulled out as a block quote.
- **Original date**: November 18, 2018 (preserved in `published_at`)

## Images (2, AI-generated)

1. **Hero image** (`src/assets/blog-serenity-hero.jpg`, ~1600×900): a meditative figure silhouetted at sunrise with soft golden light, calm water, peaceful mood — used as the featured image at the top.
2. **Inline image** (`src/assets/blog-serenity-mind.jpg`, ~1200×800): an abstract visual of a calm mind — soft glowing concentric circles / lotus over a serene watercolor background — placed mid-article, floated right (~280px) next to the "vrittis / mind viruses" paragraph, matching the size pattern we just fixed on "Our Family Business".

Both images are saved as project assets, then uploaded to the `blog-images` storage bucket so the database row references public URLs.

## How it's saved

Single `blog_posts` row inserted with `status = 'published'`, `image_layout = 'hero'`, and a `blocks` jsonb array structured as:

```
[ paragraph, quote (Epictetus), paragraph, image (side-right), paragraph, ... ]
```

Renderer already handles `side-right` correctly, so the inline image will float at ~280px with text wrapping.

## Verification

1. Visit `/post/want-to-change-stress-to-serenity` — hero image at top, body text reads cleanly, inline image floats right around the "vrittis" section.
2. Home page card shows the new post with the hero thumbnail.
3. `/admin` lists it as a published DB post (editable / re-designable with AI).

## Out of scope

- Importing the rest of the fanthespark.com archive.
- Changing the chat-bot/admin designer behavior (that was the previous question — leaving as-is for now).
- Restyling the post page.
