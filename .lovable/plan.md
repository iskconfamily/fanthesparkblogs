## Final plan — Fan The Spark rebrand (minimal)

### 1. Add logo asset
- Copy uploaded FTS logo stamp → `src/assets/fts-logo.png`
- Copy same image → `public/favicon.png`

### 2. Header — `src/components/site-header.tsx`
- Remove "sravaṇādi jala" wordmark and the "sprinkling the water…" tagline
- Add centered FTS logo stamp (~96px) wrapped in `<Link to="/">`
- Below it: **"Fan The Spark"** in **Inter Tight**, weight 600, **upright** (not italic), tracking ~-0.02em, same display size as before (`text-5xl md:text-6xl`)

### 3. Footer — `src/components/site-footer.tsx`
- `© … sravaṇādi jala` → `© … Fan The Spark`
- Keep existing italic footer line as-is

### 4. Color + font tokens — `src/styles.css`
- Add `--font-display-sans: "Inter Tight", system-ui, sans-serif;` (used by header title only — article headings keep Cormorant Garamond)
- Change `--primary` from muted burgundy → **Sandstone `#f2673a`** (in `oklch`). Cascades to links, drop caps, buttons, ring, sidebar-primary so the site visually ties to the logo.

### 5. Root meta + fonts — `src/routes/__root.tsx`
- Add **Inter Tight** to the Google Fonts URL (keep Cormorant Garamond, Lora, Libre Caslon Text)
- Add `<link rel="icon" href="/favicon.png">`

### 6. Per-route copy renames (all "sravaṇādi jala" → "Fan The Spark")
- `src/routes/index.tsx` — head title + og:title/og:description
- `src/routes/newsletter.tsx` — head title currently says "The Marginalia"; update to "The Sunday Letter — Fan The Spark"
- `src/routes/about.tsx`, `src/routes/archive.tsx`, `src/routes/tag.$slug.tsx`, `src/routes/post.$slug.tsx`, `src/routes/surprise.tsx` — scan for any "sravaṇādi jala" / "Marginalia" / "Marginalian" strings in head meta and visible copy; rename to **Fan The Spark**
- `src/components/inline-newsletter.tsx`, `src/components/sidebar.tsx`, `src/components/post-preview.tsx`, `src/components/article-body.tsx`, `src/components/byline.tsx`, `src/components/related-articles.tsx` — same scan + rename
- `src/content/posts.ts`, `src/content/queries.ts` — same scan (only string literals referring to the site name, not post content)

I'll do a project-wide grep for `sravaṇādi jala`, `sravanadi jala`, `Marginalia`, `Marginalian` and update every match to **Fan The Spark** (preserving case).

### Out of scope
- No layout, spacing, or component structure changes
- No changes to body font (Lora) or meta font (Libre Caslon Text)
- No changes to background, foreground, border, or muted color tokens — only `--primary` shifts
- No RSS / newsletter integration work

### Files touched
- `src/assets/fts-logo.png` (new), `public/favicon.png` (new)
- `src/components/site-header.tsx`, `src/components/site-footer.tsx`
- `src/styles.css`
- `src/routes/__root.tsx` + any route/component files containing the old name (final list determined by grep at implementation time)
