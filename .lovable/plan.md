## Home page text updates

Update copy in three sections of `src/routes/home.tsx`. No layout changes, no new images.

### 1. My Guru (`MyGuruFeature`, ~line 514)

Replace the `body` prop with the full text:

> Vaisesika Dasa is a disciple of His Divine Grace A.C. Bhaktivedanta Srila Prabhupada Swami. His Divine Grace A. C. Bhaktivedanta Swami Prabhupada was born in 1896 in Calcutta, India. He first met his spiritual master, Srila Bhaktisiddhanta Sarasvati Gosvami, in Calcutta in 1922. Bhaktisiddhanta Sarasvati, a prominent bhakti-yoga scholar and the founder of sixty-four branches of Gaudiya Mathas (Vedic institutes), requested His Divine Grace Srila Prabhupada to broadcast Vedic knowledge through the English language. In the years that followed, His Divine Grace Srila Prabhupada wrote a commentary on the Bhagavad-gita and in 1944, without assistance, started an English fortnightly magazine.

### 2. My Story (`MyStoryFeature`, ~line 530)

Replace the body with the new three-paragraph text plus a lead-in line:

- Lead: "Discover what inspired Vaisesika Dasa's spiritual journey as he recounts the pivotal moments that shaped his passion for sharing Bhakti Yoga with the world."
- Para 2: "Vaisesika recalls being intrigued by the mysteries of life as a young boy, but feeling frustrated in his attempts to make sense out of it all. As he searched for answers, nothing satisfied his thirst for wisdom – until his life took an unexpected turn as a teenager."
- Para 3: "Disillusioned with the depth of knowledge offered by popular culture, Vaisesika renounced worldly pursuits and became a monk at the age of fifteen."

Because `FeatureBlock`'s `body` currently renders a single `<p>`, widen it to accept `React.ReactNode` (or a string array) and render each paragraph in its own `<p>` with the existing typography. My Guru stays a single paragraph; My Story uses the three.

### 3. Books section (`BooksFeature`, ~line 667)

- Change the heading on line 730 from `Books &amp; Teachings` to `Books`.
- Stop using `post.excerpt` for the on-card description. Define an inline copy map keyed by slug so each book has its own bespoke text. Remove the 220-char truncation.
- For `our-family-business`, render the provided long-form text with a small italic subhead "Strategies For Success" between paragraphs:
  1. "In his book "Our Family Business: The Great Art of Distributing Srila Prabhupada's Books" veteran distributor Vaisesika Das shares the history, key principles and techniques of book distribution, drawing from a lifetime of experience."
  2. Subhead: *Strategies For Success*
  3. "The ISKCON spiritual community of three hundred families he developed in Silicon Valley, California is based on the study and distribution of His Divine Grace Srila Prabhupada's books, and consistently ranks high amongst the list of small temples in these efforts."
  4. ""It was great to consolidate all the things that I had learned throughout the years from mentors, and to dig deep and think about my own realizations, and how this service had actually molded my life," he says."
  5. "Our Family Business is divided into four sections. The first, Chronicles, gives a basic history of book distribution in the Gaudiya Sampradaya, in His Divine Grace Srila Prabhupada's life, and in ISKCON up to his passing in 1977, describing how it got off the ground in the U.S. and spread all over the world."
- For `the-four-questions`, keep the existing post excerpt as a fallback (user did not supply new text).
- Card description renders as multiple `<p>` blocks with existing body typography; the subhead uses display serif italic at ~18px with extra top/bottom margin. The card still links to `/wisdom/blog/$slug` and the "Read More" CTA stays.

### Technical notes

- All edits live in `src/routes/home.tsx`.
- `FeatureBlock` signature changes: `body: string` → `body: React.ReactNode`. Existing callers that pass a string keep working since a string is a valid `ReactNode`; the wrapper `<p>` becomes a `<div>` containing one or more `<p>` children so the typography styles move onto each paragraph.
- No new assets, no route changes, no schema changes.
