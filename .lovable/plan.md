## Wisdom section restructure

### Hub page (`/wisdom`) — 5 cards
Update `src/routes/wisdom.index.tsx` so the hub shows: **Lord**, **Blog**, **Videos**, **Audio Playlists**, **iTunes Podcast**. Drop the Spiritual Fitness card. Videos and iTunes cards open in a new tab (external links via `<a>` instead of `<Link>`). The `HubPage` component currently only renders internal `Link`s — I'll extend `HubLink` to accept an optional `external: true` flag and render an `<a target="_blank" rel="noopener">` in that case.

### Header dropdown
Update `NAV` in `src/components/site-header-web.tsx`. The Wisdom submenu becomes: Lord, Blog, Videos (external → YouTube), Audio Playlists, iTunes Podcast (external). Extend the dropdown child type with an optional `external` URL and render `<a>` instead of `<Link>` for those entries.

### New page: `/wisdom/lord`
New file `src/routes/wisdom.lord.tsx`. Build a real long-form editorial page using the existing `PlaceholderPage`-style hero + `Prose`/`Para`/`Dots` components. Port the full text from `https://fanthespark.com/wisdom/lord/` ("The History and Philosophy of Sri Caitanya Mahaprabhu"), broken into ~6–10 paragraphs. Eyebrow: "Wisdom", title: "Lord Chaitanya".

### New page: `/wisdom/audio-playlists`
Replace the current placeholder `src/routes/wisdom.audio-playlists.tsx` with a real page that embeds 8 SoundCloud playlists from the source site. Each section gets a heading + a responsive SoundCloud iframe (`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/{ID}&color=...&auto_play=false&show_artwork=true`). Playlist IDs (order from source): Latest Tracks (user 192337999), Bhakti Pulse, Happy Japa, Teamwork, Podcasts 2019, 2018, 2017, 2016 (214511317) — IDs pulled: 678249312, 678249039, 414360620, 304842150, 303452492, 303437955, 214511317. I'll verify ID→title mapping by re-fetching the source during build.

### External link targets
- Videos card + menu item → `https://www.youtube.com/c/FanTheSpark`
- iTunes Podcast card + menu item → **TBD**: you didn't provide the URL. I'll wire it as `#` with a `TODO` comment and ask you for it after build, OR use `https://podcasts.apple.com/us/podcast/fan-the-spark/id1153081672` if that's the correct one — please confirm.

### Files touched
- `src/routes/wisdom.index.tsx` (edit cards)
- `src/components/site-header-web.tsx` (edit NAV)
- `src/components/placeholder-page.tsx` (extend `HubLink` to support external)
- `src/routes/wisdom.lord.tsx` (new)
- `src/routes/wisdom.audio-playlists.tsx` (rewrite)

No DB or backend changes.
