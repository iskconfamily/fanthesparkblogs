
## Goal

Send blog announcements through **Mailchimp Transactional (Mandrill)** using a stored template, injecting the rendered post HTML into the `mc:edit="blog_html"` editable region. Test mode only for now — single email or a Mandrill recipient tag.

Why Mandrill (not Marketing API): `mc:edit` regions are only populated per-send via Mandrill's `messages/send-template` endpoint with a `template_content` array. The Marketing API has no equivalent.

## Scope

- Add Mandrill alongside the existing Brevo path (Brevo stays untouched).
- New server function: `sendBlogAnnouncementMailchimp` in `src/lib/email.functions.ts`.
- New helper: list Mandrill templates so the admin UI can pick one.
- Minimal admin UI: a Mailchimp section with template picker, "send to email" and "send to tag" inputs, and a Send Test button.

## New secret required

`MANDRILL_API_KEY` — Mandrill API key from Mailchimp Transactional dashboard. I'll request it via the secret tool before touching code.

## Server changes — `src/lib/email.functions.ts`

Reuse the existing `buildParams(post)` to get `blog_html` (no changes to rendering).

Add two server fns, both admin-gated via `assertAdmin`:

1. **`listMandrillTemplates`** (POST, no input)
   - `POST https://mandrillapp.com/api/1.0/templates/list` with `{ key: MANDRILL_API_KEY }`
   - Returns `[{ slug, name, subject, publish_name }]`

2. **`sendBlogAnnouncementMailchimp`** (POST)
   - Input (Zod):
     ```
     { postId: uuid,
       templateSlug: string,           // Mandrill template slug
       mode: 'email' | 'tag',
       testEmail?: email,              // when mode=email
       tag?: string }                  // when mode=tag
     ```
   - Loads post → builds `params = buildParams(post)` → extracts `blog_html`.
   - Calls `POST https://mandrillapp.com/api/1.0/messages/send-template` with:
     ```
     {
       key: MANDRILL_API_KEY,
       template_name: templateSlug,
       template_content: [{ name: 'blog_html', content: params.blog_html }],
       message: {
         subject: post.title,
         from_email: <sender>,
         from_name: <author or site>,
         to: mode==='email'
           ? [{ email: testEmail, type: 'to' }]
           : [],                       // when using tag, recipients come from tag filter
         tags: mode==='tag' ? [tag] : ['blog-announcement'],
         merge_language: 'handlebars',
         global_merge_vars: [
           { name: 'title', content: params.title },
           { name: 'excerpt', content: params.excerpt },
           { name: 'url', content: params.url },
           { name: 'author', content: params.author },
           { name: 'featured_image', content: params.featured_image },
           { name: 'slug', content: params.slug },
         ],
       },
       async: false,
     }
     ```
   - **Tag mode note**: Mandrill's `send-template` requires `to`. To send to "everyone with tag X", we'll fetch recipients via `POST /tags/all-time-series` is insufficient — instead use `POST /metadata` is not it either. The accurate path is to pre-collect recipients tagged X via `POST /tags/info` (only stats) — **Mandrill does not expose a "list members by tag" endpoint**. So for tag mode we'll instead pass the tag in `message.tags[]` and rely on the **template's own recipient logic** is also not a thing.
   - **Revised tag-mode behavior**: Mandrill doesn't have audiences/tags as recipient lists. We will therefore drop "tag" as a recipient source and keep it only as a Mandrill **labeling tag** added to `message.tags[]`. For now, mode is effectively just `email` (one or more comma-separated test addresses) plus an optional tag label for tracking.
   - Final input shape:
     ```
     { postId, templateSlug,
       recipients: string  // comma-separated emails
       trackingTag?: string }
     ```
   - Validate `blog_html` non-empty (same guard as Brevo path).
   - Return `{ recipientCount, mandrillResponse: [{ email, status, _id, reject_reason }] }`.

Sender constants: reuse `SITE_URL` host; from_email = `noreply@fanthesparkblogs.lovable.app` (or env `MANDRILL_FROM_EMAIL` if set). I'll add a `MANDRILL_FROM_EMAIL` optional secret note in the plan but not block on it.

## Admin UI changes — `src/components/admin/blog-studio.tsx` (or wherever Brevo controls live)

Add a small "Mailchimp (test)" panel next to existing Brevo controls:
- Template `<Select>` populated from `listMandrillTemplates`
- Recipients `<Input>` (comma-separated emails)
- Optional tracking tag `<Input>`
- "Send Mailchimp test" button → calls `sendBlogAnnouncementMailchimp`
- Toast with per-recipient status from the response

I'll locate the current Brevo UI block first and mirror its layout.

## What's NOT in this plan

- No Mandrill broadcast / audience send (Mandrill has no audience concept).
- No suppression/bounce dashboard.
- Brevo flow remains as-is.
- `mc:edit` regions other than `blog_html` are not populated. If the template has more editable regions, they'll show their default content.

## Files touched

- `src/lib/email.functions.ts` — add 2 server fns, no change to `buildParams` / `buildBlogEmailHtml`.
- One admin component file (TBD after locating Brevo controls) — add Mailchimp panel.
- New secret: `MANDRILL_API_KEY` (requested via secret tool first).
