## Goal

Author a post once (title, body, featured image, `imageLayout`) and have it render with the **same visual design** on both the home page card and the individual post page. Today, the home page respects `post.imageLayout` ("side" wraps text around a floated image; "hero" stacks image between paragraphs), but the post detail page hardcodes the hero pattern — so a "side" post looks different in the two places.

## Plan

### 1. Extract a shared `PostArticle` component

Create `src/components/post-article.tsx` that owns the title → date → byline → image+body layout switch. Both `PostPreview` (home) and the post detail route render this component, so any future styling change lives in one file.

Props:
```ts
{
  post: Post;
  as?: "h1" | "h2";              // h1 on detail page, h2 on home card
  titleClassName?: string;        // detail uses text-4xl md:text-5xl, home uses text-3xl md:text-4xl
  titleLink?: { to: "/post/$slug"; slug: string }; // home wraps title in a Link, detail does not
}
```

Internal structure (identical for both call sites):
- Title block (`max-w-[560px]`) — `h1` or `h2`, optional `Link` wrapper, italic serif-display, brand title color
- Uppercase date below the title
- `<Byline author={post.author} />`
- Image+body layout switch driven by `post.imageLayout`:
  - `"side"` → `<Figure>` with `float-right ml-6 mb-3 w-[44%] max-w-[280px]`, caption left-aligned, then `<ArticleBody blocks={post.body} />`, then `clear-both` spacer
  - `"hero"` (default) → first body block → `<Figure className="my-8">` → remaining body blocks
  - `"none"` (or any other value) → just `<ArticleBody blocks={post.body} />`, no figure
- The `Figure` helper currently inside `post-preview.tsx` moves into this file (or a sibling).

### 2. Update `src/components/post-preview.tsx`

Replace its body with:
- `<PostArticle post={post} as="h2" titleClassName="text-3xl md:text-4xl" titleLink={{ to: "/post/$slug", slug: post.slug }} />`
- Keep the outer `<article className="border-b border-border pb-16 mb-16 last:border-b-0">` wrapper and the "Permalink" link at the bottom.

### 3. Update `src/routes/post.$slug.tsx`

In `PostPage`, replace the inline title + byline + figure + ArticleBody block with:
- `<PostArticle post={post} as="h1" titleClassName="text-4xl md:text-5xl" />`
- Keep `<SiteLayout>`, the outer `<article>` wrapper, `<InlineNewsletter />`, and `<RelatedArticles posts={related} />` exactly where they are.

### 4. Workflow guarantee going forward

After this refactor:
- Every visual decision about a post (title type scale, byline placement, image layout variants, captions, spacing) lives in `PostArticle`.
- Adding a new `imageLayout` variant (e.g. `"full-bleed"`) is a single change that automatically applies to both home and detail.
- The only differences between the two views are intentional and prop-driven: heading level, title size, and whether the title is a link.

### Out of scope

- `ArticleBody`, `InlineNewsletter`, `RelatedArticles`, `SiteLayout`, archive page, email templates.
- Content data and `imageLayout` values on existing posts.
- The LastPass-extension hydration warning visible in the runtime errors (browser extension, not a code issue).
