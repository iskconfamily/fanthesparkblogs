## Goal

Add a sign-off to the "Fresh and Easy" draft blog post: Vaisesika Dasa's signature image, followed by his name.

## Change

Append two blocks to the end of `blocks` JSON on the `blog_posts` row where `slug = 'fresh-and-easy'`:

1. **Image block** — signature
   - `src`: `https://ghifedcfmauydlmexrxc.supabase.co/storage/v1/object/public/blog-images/signature-vaisesika.png`
   - `alt`: `signature`
   - `layout`: `hero` (the renderer auto-detects `/signature` and `signature*` alt → caps at 180px on both site and email, per the existing `ArticleBody` and `email-html.ts` rules)

2. **Paragraph block** — `Vaisesika Dasa`

Done via a single `UPDATE blog_posts SET blocks = blocks || '[...]'::jsonb WHERE slug='fresh-and-easy'` migration.

## Out of scope

- No renderer or email template changes (signature sizing already handled generically).
- No changes to other posts.
- Post stays a draft.
