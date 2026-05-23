## Build out Next Steps & Serve (hubs + sub-pages)

Content ported verbatim from fanthespark.com (no editorial first-person additions). Design is mine; images pulled from source where they earn their place.

### Header menu (`src/components/site-header-web.tsx`)
- **Next Steps**: Ask Vaisesika Dasa · Small Groups Near You · Spiritual Retreat · Other Projects *(new)*
- **Serve**: Servant Leaders *(new, first)* · Give · Volunteer · Transformational Stories

### Hub pages (4 cards each, matching menu)
- `src/routes/next-steps.index.tsx`
- `src/routes/serve.index.tsx`

### Sub-pages — content ported from source
| Route file | Source URL |
|---|---|
| `next-steps.ask.tsx` | `/next-steps/ask-vaisesika-dasa/` |
| `next-steps.small-groups.tsx` | `/next-steps/small-groups-near-you/` |
| `next-steps.spiritual-retreat.tsx` | `/next-steps/spiritual-retreat/` |
| `next-steps.other-projects.tsx` *(new)* | `/next-steps/other-projects/` |
| `serve.servant-leaders.tsx` *(new)* | `/serve/servant-leaders/` — portrait grid |
| `serve.volunteer.tsx` | `/serve/volunteer/` |
| `serve.give.tsx` | `/serve/give/` |
| `serve.transformational-stories.tsx` | `/serve/transformational-stories/` — story cards w/ photos |

### Approach
- Each page: hero band (eyebrow + title from source), body copy in `<Para>` blocks preserving line breaks/italics/quotes, contextual layout (portrait grid, story cards, or prose), shared `ContactSection` at bottom.
- Images: hot-link from `fanthespark.com/wp-content/uploads/...` where meaningful (portraits, story photos, supporting visuals). Skip where source has none.
- Each route sets its own `head()` meta (title, description, og:title, og:description).
- Slugs preserved so existing links don't break.
