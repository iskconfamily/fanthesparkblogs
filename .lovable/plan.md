# Literary Long-Form Blog — Build Plan

A quiet, archival, text-first publication with a warm cream background, dark serif typography, muted burgundy accents, narrow reading column, and a dense curated left sidebar. Three routes, fully responsive, original content + placeholder imagery.

## Pages (TanStack Start routes)

```
src/routes/
  __root.tsx            existing shell — keep
  index.tsx             Home: vertical essay feed + sidebar
  about.tsx             Simple editorial about page
  archive.tsx           Full chronological archive
  newsletter.tsx        Newsletter signup page
  surprise.tsx          Picks a random post and redirects
  tag.$slug.tsx         Category/tag archive (e.g. /tag/poetry)
  post.$slug.tsx        Single article page
```

Each route sets its own `head()` with unique title + description + og tags.

## Layout & components

```
src/components/
  site-header.tsx       Wordmark + tagline + nav (Home, About, Archive,
                        Poetry, Books, Newsletter, Surprise Me)
  site-footer.tsx       Minimal serif footer, archive + tag links
  site-layout.tsx       Two-column wrapper: <main> + <Sidebar/>; stacks on mobile
  sidebar.tsx           Composes the modules below
  sidebar/
    featured-book.tsx   Cover thumbnail + blurb
    newsletter-block.tsx Email input, no payments wording
    archive-links.tsx   Year/month list
    tag-cloud.tsx       Category links
    favorite-reads.tsx  Small thumbnails + text links
    social-links.tsx    RSS, email, Mastodon, etc. (text links)
  post-preview.tsx      Home/tag feed entry: kicker tag, serif title,
                        featured image, excerpt, "Continue reading"
  article-body.tsx      Prose container with pull-quote + figure helpers
  pull-quote.tsx
  figure.tsx            Image + caption
  related-articles.tsx
```

No donation / support / patronage / payment UI anywhere.

## Content model

`src/content/posts.ts` exports a typed array used by every page (ready to swap for a CMS later).

```ts
export type Post = {
  slug: string;
  title: string;
  subtitle?: string;
  category: string;        // primary kicker
  tags: string[];          // e.g. ["poetry", "nature"]
  date: string;            // ISO
  excerpt: string;
  featuredImage: { src: string; alt: string; caption?: string };
  body: ArticleBlock[];    // paragraphs, pull quotes, figures, headings
  relatedSlugs?: string[];
};
```

Helpers in `src/content/queries.ts`: `getAllPosts`, `getPostBySlug`, `getPostsByTag`, `getRelated`, `getRandomPost`. ~8–10 placeholder essays across tags: poetry, books, philosophy, science, art.

## Design system (`src/styles.css`)

Replace tokens with a warm aged-paper palette (oklch equivalents of):

- `--background`: #f6f0e4 (warm ivory)
- `--foreground`: #2b2520 (deep charcoal)
- `--primary` (links/accent): #8f3028 (muted burgundy)
- `--muted-foreground`: warm brown-gray
- `--border`: soft tan
- `--card`: slightly lighter cream

Typography via Google Fonts in `__root.tsx` head:
- Headings: **Cormorant Garamond** (titles), **Playfair Display** option
- Body: **Lora** (18–20px, line-height 1.75)
- Nav/meta: **Libre Caslon Text** or fall back to Georgia

Add font-family CSS variables (`--font-serif-display`, `--font-serif-body`, `--font-meta`) and tailwind utilities. Sharp corners (radius ~2px), no shadows, hairline tan separators between feed entries.

## Page composition

**Home** — `SiteLayout` with feed of `PostPreview` (no hero, no cards). Sidebar shows featured book, newsletter, recent essays w/ thumbnails, tag list, RSS/social.

**Tag archive** (`/tag/$slug`) — Page title (e.g. "Poetry"), short descriptive paragraph, chronological `PostPreview` list, same sidebar.

**Article** (`/post/$slug`) — Kicker (category), large serif title, optional deck, byline + date, featured figure, `ArticleBody` (serif prose, pull quotes, inline figures with captions, accent links), newsletter block, related articles, same sidebar.

**Surprise Me** — loader picks random slug, `throw redirect({ to: "/post/$slug", params })`.

## Imagery

Use neutral placeholder imagery (e.g. `https://images.unsplash.com/...` with `?w=800&auto=format` queries) for book covers and featured images. Captions read like archival plates ("Plate VII from a 1894 botanical study"). No copyrighted/branded assets from the reference.

## Responsive behavior

- ≥1024px: two columns, sidebar ~300px left, content max-width ~720px.
- 768–1023px: single column; sidebar modules collapse to a compact strip after the first 1–2 entries.
- <768px: single column; sidebar modules appear after the main intro; nav becomes a simple wrapped row (no hamburger needed for a text nav this short).

## Out of scope (per spec)

- No donations / Patreon / fundraising / payment UI.
- No card grids, gradient heroes, modern SaaS chrome, or heavy animation.
- No backend yet; content is a typed local module ready for CMS swap.

## Verification

After build: visit `/`, `/tag/poetry`, a sample `/post/...`, `/surprise`; check mobile viewport stacking; confirm no placeholder boilerplate remains on index.
