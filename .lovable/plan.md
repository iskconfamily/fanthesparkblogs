## Add RSS feed

Add a real RSS 2.0 feed at `/rss.xml` and wire the sidebar's RSS icon to it.

### What gets built

1. **New server route** `src/routes/rss[.]xml.ts`
   - File name uses the `[.]` escape so the route resolves to `/rss.xml`.
   - `GET` handler builds an RSS 2.0 XML document:
     - Channel: title "Fan The Spark", site link, description, language `en-us`, `lastBuildDate`.
     - Items: merged list of published DB posts (`getPublishedDbPosts`) + static posts (`getAllPosts`), de-duped by slug, sorted by date desc, capped at 50.
     - Each `<item>`: `title`, `link` (absolute URL to `/post/{slug}`), `guid` (same), `pubDate` (RFC-822), `category`, `description` (excerpt, XML-escaped, CDATA-wrapped).
   - Returns `Response` with `Content-Type: application/rss+xml; charset=utf-8` and a short `Cache-Control` (e.g. `public, max-age=600`).
   - Absolute base URL derived from request host via `getRequestHost()` so it works on preview, published, and custom domains.

2. **Sidebar link** (`src/components/sidebar.tsx`)
   - Replace the placeholder `href="#"` RSS link with `href="/rss.xml"` (plain `<a>`, opens in new tab).

3. **Discovery tag** (`src/routes/__root.tsx`)
   - Add `<link rel="alternate" type="application/rss+xml" title="Fan The Spark RSS" href="/rss.xml" />` so browsers/readers auto-detect it.

### Out of scope
- No per-tag feeds (e.g. `/tag/bhakti-notes/rss.xml`) — can be added later if you want.
- No full HTML content in items, just the excerpt (keeps the feed light and avoids rendering the block model to HTML).
