# Add portrait to /blog2 post byline

## What changes

In `src/components/blog-layouts/PostMinimal.tsx`, replace the text-only byline with a version that includes the Vaisesika portrait — styled to match the `/blog2` minimal aesthetic (cream card, blue eyebrow, serif body).

**Before:**
```tsx
<p className="post-minimal-byline mb-12">
  By {post.author} • {formatDate(post.date)}
</p>
```

**After:** small circular portrait (40px) on the left, author + date to the right, keeping the existing `post-minimal-byline` typography (uppercase eyebrow style). Same vertical rhythm (`mb-12`).

Use the existing `@/assets/vaisesika-portrait.jpg` asset (already used by the shared `<Byline>` component). Add `loading="lazy"` and `alt={author}`.

No style-token changes; no other files touched.

## Should it go in the email too?

**Recommendation: yes, but as a small inline portrait — not a Gravatar lookup.**

- **Local image (recommended):** host the portrait at a public URL (e.g. published site `/assets/...`) and reference it via absolute `<img src="https://…">` in the email. Works in every client, no privacy prompts, matches the web byline 1-to-1.
- **Gravatar:** technically works (it's just an `<img>`), but: (1) requires the author's email hash, (2) some corporate mail clients block third-party images until the user clicks "show images", (3) gives a generic fallback if no Gravatar exists. Not worth it for a single known author.
- **Sizing:** keep it 40×40 with `border-radius: 9999px` inline. Gmail strips `border-radius` on some Android clients, so the image will appear square there — acceptable fallback.

Not building the email now (per earlier decision) — this is just the answer.
