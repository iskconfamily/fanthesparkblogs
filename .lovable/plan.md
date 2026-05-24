## Scope

Single-file edit: `src/routes/home.tsx`. No header/footer/shared component changes.

## 1. My Guru featured section — real content + image

- Copy the uploaded `user-uploads://Prabhupada3-4.png` into `src/assets/my-story/prabhupada-group.jpg` and import it.
- Replace the placeholder image in `MyGuruFeature` with this new asset. Use `object-cover` with `objectPosition: "center 30%"` so Prabhupada's face stays centered on all aspect ratios; crop is handled by the container (no manual resize needed — CSS does it).
- Replace the teaser paragraph with the exact copy from the screenshot:
  > "Vaisesika Dasa is a disciple of His Divine Grace A.C. Bhaktivedanta Srila Prabhupada Swami. His Divine Grace A. C. Bhaktivedanta Swami Prabhupada was born in 1896 in Calcutta, India. He first met his spiritual master, Srila Bhaktisiddhanta Sarasvati Gosvami, in Calcutta in 1922. Bhaktisiddhanta Sarasvati, a prominent bhakti-yoga scholar and the founder of sixty-four branches of Gaudiya Mathas (Vedic institutes), requested His Divine Grace Srila Prabhupada to broadcast Vedic knowledge through the English language. In the years that followed, His Divine Grace Srila Prabhupada wrote a commentary on the Bhagavad-gita and in 1944, without assistance, started an English fortnightly magazine."
- CTA label → **"Read About Srila Prabhupada Swami"**, link stays `/my-journey/my-guru`.
- Eyebrow stays "My Journey", heading stays italic serif **"My Guru"**.

## 2. Books & Teachings — wire real books

Use the two existing blog posts as the books:

| Card | Title | Cover (existing asset) | Excerpt source | CTA link |
|---|---|---|---|---|
| 1 | Our Family Business | `@/assets/post-family-business.jpg` | post excerpt (line 449-450) | `/wisdom/blog/our-family-business` |
| 2 | The Four Questions | `@/assets/post-four-questions.jpg` | post excerpt (line 477-478) | `/wisdom/blog/the-four-questions` |

Pull data via `getPostBySlug("our-family-business")` / `getPostBySlug("the-four-questions")` from `@/content/queries` so titles/excerpts/covers stay in sync with the posts. CTA button: "Read More →". Remove the `blog-gita-book.jpg` placeholder.

## 3. Section order — move Latest Writings up

New order after Hero + Start Here:

```
My Guru featured
Latest Videos
Latest Audio
Latest Writings        ← moved here (from below Books)
My Story featured
Books & Teachings
Upcoming Events
How Can I Be Of Service (ServeBand)
Servant Stories
```

No design/styling changes to those sections — just reordering the JSX.

## Out of scope

- No changes to header, footer, sidebar, blog pages, shared components, or styles.
- No new design tokens; reuse existing `--font-serif-display`, `--brand-gold`, etc.
