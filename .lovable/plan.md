# Image Optimization Plan

Several assets are large (1–3 MB each), dominating page weight and slowing first paint. Goal: dramatically reduce bytes shipped without visible quality loss, serve modern formats with responsive sizes, and let the browser load non-critical images later.

## What's heavy today

Worst offenders in `src/assets/`:
- `my-story/vaisesika-meditation.png` — 3.0 MB (home + my-story hero)
- `my-guru/prabhupada-hero.png` — 2.6 MB
- `my-story/vaisesika-portico.png` — 2.1 MB
- `my-story/hero-forest.jpg` — 2.2 MB
- `my-story/temple-namaste.jpg` — 1.7 MB
- `my-story/prabhupada-group.jpg` — 1.4 MB (home)
- `my-guru/prabhupada-laughing.png` — 1.4 MB
- `hero-crowd-bg.png` — 679 KB (home hero background)
- Various 200–500 KB PNGs/JPGs

None of the heavy PNGs need transparency — they're photographs saved as PNG.

## Approach

1. **Install `vite-imagetools` + `sharp`** and register the plugin in `vite.config.ts` (via the `vite.plugins` passthrough on `@lovable.dev/vite-tanstack-config`). This lets us request format and size variants at import time, producing hashed, cached, properly sized outputs.

2. **Convert heavy photographic PNG sources to JPG/WebP** once at the source (one-off `sharp` script) and resize anything wider than ~2000 px down to a max width of 2000 px (full-bleed retina) or 1200 px for inline content. Re-encode large JPGs at quality 78–82. Keep true logos/marks (`fts-logo*.png`, `dots.png`) as PNG/WebP-with-alpha.

3. **Serve responsive, modern formats via `<picture>` + `srcset`** for hero and large content images. Default to AVIF for the heaviest heroes, falling back to WebP and then the original. Using `vite-imagetools` query syntax:

   ```tsx
   import heroAvif from "./hero.jpg?w=600;1200;2000&format=avif&as=srcset"
   import heroWebp from "./hero.jpg?w=600;1200;2000&format=webp&as=srcset"
   import heroFallback from "./hero.jpg?w=1600&format=jpg"

   <picture>
     <source type="image/avif" srcSet={heroAvif} sizes="(max-width: 2000px) 100vw, 2000px" />
     <source type="image/webp" srcSet={heroWebp} sizes="(max-width: 2000px) 100vw, 2000px" />
     <img src={heroFallback} alt="…" />
   </picture>
   ```

   Apply to: home hero (`hero-crowd-bg`, `hero-stamp`, `transformational-stories-v3`), my-story hero (`vaisesika-meditation`), my-guru hero (`prabhupada-hero`), and the largest inline images on my-story / my-guru.

4. **Preload the LCP image** on the home route via TanStack `head().links` (`rel="preload" as="image" href=... imagesrcset=... imagesizes=... fetchpriority="high"`) so the hero appears immediately.

5. **Lazy-load below-the-fold images** by adding `loading="lazy"` + `decoding="async"` to non-hero `<img>` tags (post tiles, sidebar thumbnails, my-guru gallery, story tiles on `/my-journey`). Already present on some — extend to the rest. Hero images stay eager with `fetchpriority="high"`.

6. **Spot-check after**: load home, /my-journey, /my-journey/my-story, /my-journey/my-guru, and a blog post in the preview; confirm images still look right and the network panel shows the smaller AVIF/WebP transfers.

## Out of scope

- No layout, copy, or design changes.
- No CMS/dynamic image pipeline — all images are bundled assets, so build-time optimization is enough.
- Won't touch `src/integrations/supabase/*`, routing, or unrelated components.

## Technical notes

- `bun add -D vite-imagetools sharp`.
- Register plugin: pass `vite.plugins: [imagetools()]` through `@lovable.dev/vite-tanstack-config`'s `defineConfig`. Verify no duplicate plugin conflict at build time.
- Expected savings on the heaviest routes: ~15 MB → ~2–3 MB of image transfer.
- A small `tools/optimize-source-images.ts` `sharp` script (run once) overwrites the worst PNG sources as resized JPG/WebP and we update those imports. Combined with `?format=…&w=…` query-param variants, we get both smaller sources and per-viewport delivery.
