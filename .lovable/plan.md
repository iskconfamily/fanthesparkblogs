## Goal
When sending a blog post as an email, let the admin choose which Brevo list to send to (instead of the hardcoded list #3).

## Changes

### 1. `src/lib/email.functions.ts`
- Add new server fn `listBrevoLists` (admin-only): GET `${GATEWAY_URL}/contacts/lists?limit=50&offset=0`, return `[{ id, name, totalSubscribers }]`.
- Update `sendBlogEmail` server fn:
  - Add optional `listId: number` to input validator (default to existing `BREVO_LIST_ID = 3` for backward compatibility).
  - Replace the two hardcoded `BREVO_LIST_ID` references in the broadcast contact-fetch loop with the resolved `listId`.
  - Include the chosen list id in returned status / error messages.
- Keep `BREVO_LIST_ID = 3` only as the fallback default.

### 2. Blog Studio send dialog (the component that calls `sendBlogEmail`)
- On dialog open, call `listBrevoLists` via `useServerFn` + `useQuery`.
- Render a `<Select>` showing "{name} ({totalSubscribers})" — default to list 3 if present, else first list.
- Pass selected `listId` into the `sendBlogEmail` call.
- Show inline error if the list call fails (e.g. missing scope) with a retry button.

### 3. Verification
- Type-check passes.
- Dialog shows list dropdown, defaults to current list, switching list and sending hits the Brevo `/contacts/lists/{id}/contacts` endpoint for the chosen id (verified via server logs).

## Notes
- No DB changes — selection is per-send only, not persisted on the post.
- If you'd like the chosen list saved per post (so re-sends remember it), say so and I'll add a `brevo_list_id` column to `blog_posts` plus persist on send.
