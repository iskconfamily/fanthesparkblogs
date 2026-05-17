# Email integration with Brevo

You'll manage subscribers inside Brevo's dashboard. The app just tells Brevo "send this blog to that list."

## How it will work (your day-to-day)

1. In Brevo's dashboard, you create one **Contact List** (e.g. "Fan The Spark Blog Subscribers") and add/import emails there.
2. In the blog admin editor, two new buttons appear:
   - **Send test email to: [your@email]** — fires one email to that address only. Use this to preview before broadcasting.
   - **Send announcement to subscribers** — sends to your full Brevo list. Has a confirm dialog showing the recipient count.
3. Publishing a blog stays separate from emailing. Nothing goes out automatically — you decide when to click "Send announcement." This is the safest setup for testing.
4. Each blog tracks whether an announcement was sent (date + recipient count), so you don't accidentally double-send.

## What the email will look like

- Subject: the blog title
- Body: blog title, featured image, excerpt, "Read full post" button linking to the live blog URL, simple olive-themed styling matching the site
- From: a `noreply@…` sender (we'll pick a verified Brevo sender during setup)

## Setup steps I'll need from you

1. **Connect Brevo** — I'll trigger the Brevo connector and you'll paste your Brevo API key (from Brevo → SMTP & API → API Keys).
2. **Verify a sender in Brevo** — in Brevo's dashboard, add and verify the "From" email (e.g. `noreply@fanthespark.com` or just your gmail for testing). Tell me which address to use.
3. **Create the Brevo list** — make one Contact List in Brevo and tell me its **List ID** (visible in the URL or list settings).

## What I'll build

- A small server function `sendBlogAnnouncement(postId, mode)` where `mode` is `"test"` (single email) or `"broadcast"` (Brevo list). It calls Brevo's transactional email API through the connector gateway.
- Two buttons + a test-email input in `src/components/admin/post-editor.tsx`.
- A new column `announcement_sent_at` on `blog_posts` to record broadcasts.
- A small toast/notification showing success or error from Brevo.

## What's NOT in this plan (we can add later)

- Auto-send on publish
- Subscribe form on the public site (subscribers come from Brevo for now — you can import a CSV there)
- Open/click tracking dashboards (Brevo has these in its own UI)
- Scheduled/delayed sending

## Technical details

- Brevo connector uses Lovable's connector gateway, so the API key is stored securely server-side — never exposed to the browser.
- Endpoint used: `POST /smtp/email` via `https://connector-gateway.lovable.dev/brevo/smtp/email`.
- For broadcast mode, we pass `{ to: [{ email: "noreply@…" }], bcc: [...everyone from list...] }` OR use Brevo's `messageVersions` / list-targeted sending — I'll use whichever Brevo recommends for the list ID approach (likely fetching contacts from the list, then sending in batches of ~50 BCC, or using Brevo's campaign API for true list send).
- Migration adds: `ALTER TABLE blog_posts ADD COLUMN announcement_sent_at timestamptz, ADD COLUMN announcement_recipient_count int;`
- Server function is admin-protected via `requireSupabaseAuth` + `has_role(uid, 'admin')` check.

Approve this and I'll start with step 1 (connecting Brevo).
