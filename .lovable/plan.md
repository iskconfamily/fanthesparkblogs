## Goal
Make the post detail page (`/post/$slug`) read like the home page card for the same post — same opening rhythm (lead paragraph → image → rest) and same visual styling for title/byline/body.

## Observation
Home (`PostPreview`, `hero` layout):
- Title + date in a `max-w-[560px]` block
- Byline
- First body block as lead paragraph
- Featured `<figure className="my-8">`
- Remaining body blocks

Post page today:
- Same title + date + byline block
- Featured `<figure className="my-8">` (BEFORE any body)
- Entire body

The title block, byline, and figure markup are already identical. Only the order of "image vs first paragraph" differs.

## Change — single file: `src/routes/post.$slug.tsx`
In `PostPage`, replace the current figure + `<ArticleBody blocks={post.body} />` sequence with the hero-layout split used in `PostPreview`:

```tsx
const [first, ...rest] = post.body;
// ...
{first && <ArticleBody blocks={[first]} />}
<figure className="my-8">
  <img src={post.featuredImage.src} alt={post.featuredImage.alt} className="w-full" />
  {post.featuredImage.caption && (
    <figcaption
      className="mt-2 text-sm italic text-muted-foreground text-center"
      style={{ fontFamily: "var(--font-serif-display)" }}
    >
      {post.featuredImage.caption}
    </figcaption>
  )}
</figure>
{rest.length > 0 && <ArticleBody blocks={rest} />}
```

Keep `<InlineNewsletter />` and `<RelatedArticles />` after the body, unchanged.

## Out of scope
- No changes to `PostPreview`, `ArticleBody`, `Byline`, or any styles.
- No changes to home page, archive, or email templates.
- Title stays at `text-4xl md:text-5xl` on the post page (one size up from the home card's `text-3xl md:text-4xl`) — that's the standard "detail page is slightly larger" convention; if you want them identical too, say so and I'll match.

## Verification
Open `/post/the-khatvanga-moment` and compare side-by-side with its card on `/` — the opening paragraph, then the leaf image, then the rest of the essay should appear in the same order with the same spacing.