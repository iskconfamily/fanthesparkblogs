## Goal

Replace the current "fetch list contacts + SMTP-blast with HTML" flow with Brevo's **Email Campaigns** API. The admin picks an existing Brevo campaign (designed in Brevo with `{{ params.X }}` placeholders), and Lovable only sends the **params** (title, subject, url, excerpt, author, image, slug) + triggers `sendNow`. The campaign's own list + HTML stay the source of truth.

The current list-blast path is replaced (per your earlier "campaigns instead of list" wording). The "Send test" button stays but is rebuilt on the campaign API too (`/emailCampaigns/{id}/sendTest`).

## What changes for the admin

In the post editor's "Email announcement" section:

- The "Brevo list" dropdown is replaced by a **Brevo campaign** dropdown listing draft (and optionally sent/scheduled) campaigns: `Name — status — list "X"`.
- A small read-only **"Params being sent"** preview shows the key/value pairs that will be merged: `subject`, `title`, `excerpt`, `url`, `author`, `featured_image`, `slug`.
- "Send test email" — sends the chosen campaign to the typed test address.
- "Send to subscribers" — calls `sendNow` on the campaign.

## Technical changes

### `src/lib/email.functions.ts`

Remove the SMTP-loop send path. Replace with three campaign-backed server fns. All keep `requireSupabaseAuth` + `assertAdmin`.

1. **`listBrevoCampaigns`** (replaces `listBrevoLists`)
   - `GET ${GATEWAY_URL}/emailCampaigns?type=classic&status=draft&limit=50` (status filter optional, default `draft,sent,queued`).
   - Returns `{ ok, campaigns: [{ id, name, status, subject, listIds }] }`.

2. **`getBrevoCampaignInfo(campaignId)`** (replaces `getBrevoListInfo`)
   - `GET /emailCampaigns/{id}` — used to confirm before send and surface recipient count by reading the campaign's `recipients.listIds` then `GET /contacts/lists/{listId}` for `totalSubscribers`.

3. **`sendBlogAnnouncement`** — keep the name + input shape but redo the handler:
   - Input: `{ postId, mode: "test"|"broadcast", testEmail?, campaignId: number }` (replaces `listId`).
   - Build `params` from the post:
     ```ts
     const params = {
       subject: post.title,
       title: post.title,
       excerpt: post.excerpt ?? "",
       url: `${SITE_URL}/post/${post.slug}`,
       author: post.author ?? "",
       featured_image: post.featured_image ?? "",
       slug: post.slug,
     };
     ```
   - Update the campaign with these params + subject so `{{ params.subject }}` resolves and the actual Subject line is set:
     `PUT /emailCampaigns/{campaignId}` body `{ params, subject: post.title }`.
   - Then:
     - `mode = "test"` → `POST /emailCampaigns/{id}/sendTest` body `{ emailTo: [testEmail] }`.
     - `mode = "broadcast"` → `POST /emailCampaigns/{id}/sendNow` (empty body).
   - On broadcast success, write `announcement_sent_at` + best-effort `announcement_recipient_count` (from list totalSubscribers) back to `blog_posts`.
   - Drop all `htmlContent`/`textContent`/`bcc`/SMTP loop code — Brevo renders from its own design.

Delete: `buildEmail`, `renderBlocks`, `renderInlineHtml`, `renderImg`, `renderSideFigure`, `renderImageTextTable`, `renderGallery`, `renderNewsletterCta`, `renderCaption`, `renderParagraph`, `escapeHtml`, `jsonBlocksToEmail`, `parseContentForEmail`, `parseGalleryForEmail`, `blocksToText`, all `FONT_*`/color constants, `ContentBlock`/`GalleryImg`/`FigureLayout` types. Keep `SENDER_EMAIL`/`SENDER_NAME`/`SITE_URL` only if still used; otherwise prune. Keep `assertAdmin`, `brevoHeaders`, `GATEWAY_URL`.

### `src/components/admin/post-editor.tsx`

- Rename state: `brevoLists` → `brevoCampaigns`, `selectedListId` → `selectedCampaignId`, `listsError` → `campaignsError`.
- Replace the `<select>` options with campaigns: `{c.name} — {c.status}`.
- Replace `fetchListInfo` call with `fetchCampaignInfo`; confirm dialog reads "Send '{title}' via campaign '{campaign.name}' to list '{listName}' ({count} subscribers)?".
- Pass `campaignId` (not `listId`) to `sendEmail`.
- Add a small static "Params" preview block under the dropdown:
  ```
  subject = {title}
  title   = {title}
  excerpt = {excerpt|truncated}
  url     = https://…/post/{slug}
  author  = {author}
  featured_image = {featuredImage}
  slug    = {slug}
  ```
  So the admin knows what `{{ params.X }}` will resolve to in Brevo.

### Default param set sent to Brevo

Since you didn't pin a list, I'm shipping these — say "also add X" and I'll extend:

| param key | source | template usage example |
|---|---|---|
| `subject` | `post.title` | `{{ params.subject }}` (also written to campaign's Subject field) |
| `title` | `post.title` | `<h1>{{ params.title }}</h1>` |
| `excerpt` | `post.excerpt` | `<p>{{ params.excerpt }}</p>` |
| `url` | `${SITE_URL}/post/${post.slug}` | `<a href="{{ params.url }}">Read on site</a>` |
| `author` | `post.author` | `by {{ params.author }}` |
| `featured_image` | `post.featured_image` | `<img src="{{ params.featured_image }}">` |
| `slug` | `post.slug` | tracking / custom links |

### Verification

1. Type-check passes; preview loads.
2. Dropdown lists draft campaigns from Brevo (`/emailCampaigns?status=draft`).
3. "Send test" hits `PUT /emailCampaigns/{id}` then `POST /emailCampaigns/{id}/sendTest` — test arrives with placeholders resolved.
4. "Send to subscribers" hits `sendNow` and Brevo dashboard shows the campaign moving from draft → queued/sent.
5. `blog_posts.announcement_sent_at` updates.

## Notes / decisions for you

- **One-shot vs reuse:** Same draft campaign can be reused per post — each send overwrites `params` + `subject` before triggering. If you'd rather **clone** the campaign each time (so each post becomes its own row in Brevo Campaigns reporting), say so and I'll switch the broadcast path to `POST /emailCampaigns` (clone draft → set params → sendNow).
- **Sent campaigns can't be re-sent** in Brevo. The dropdown will filter to `status=draft` (and `queued`) by default. Want sent campaigns visible too (e.g. for reference)? Tell me.
- **Params you want renamed** (e.g. `SUBJECT` uppercase, or `post_url` instead of `url`)? Default is lowercase snake. Easy to change.
- No DB changes.
