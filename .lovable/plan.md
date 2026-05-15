# Admin Blog Management System

## Overview
Add a Supabase-backed blog CMS so an admin can write, AI-draft, preview, publish, and unpublish posts. Public site reads from the database (published only); existing static `src/content/posts.ts` posts remain as a fallback/seed.

## 1. Enable Lovable Cloud
Provision Supabase (database + auth + storage for featured images).

## 2. Database (migration)
- `blog_posts` table with: `id (uuid pk)`, `title`, `slug (unique)`, `excerpt`, `content (text)`, `featured_image (text url)`, `category`, `author`, `status` (enum `draft`/`published`), `created_at`, `updated_at`, `published_at`. Trigger updates `updated_at`.
- `app_role` enum (`admin`, `user`) + `user_roles` table (separate from profiles per security rules).
- `has_role(uuid, app_role)` SECURITY DEFINER function.
- Storage bucket `blog-images` (public read).

## 3. RLS policies
- `blog_posts`:
  - SELECT for `anon` + `authenticated`: only `status = 'published'`.
  - SELECT/INSERT/UPDATE/DELETE for admins (via `has_role`).
- `user_roles`: only admins can manage; users can read their own.
- Storage: public read on `blog-images`, admin-only write.

## 4. Auth
- Email/password sign-in at `/admin/login` (auto-confirm email enabled).
- `/_authenticated` style guard on `/admin/*` — redirect to login if not signed in or not admin.
- First admin: bootstrap by inserting a row in `user_roles` after the user signs up (documented; user can do via SQL or we provide a one-time seed flow).

## 5. Routes & UI
- `/admin/login` — sign in form.
- `/admin` — list posts (drafts + published) with status badges, edit/delete/publish/unpublish actions, "New post" button.
- `/admin/new` and `/admin/edit/$id` — editor with:
  - Title, slug (auto from title, editable), excerpt, category, author, content (textarea / markdown), featured image upload.
  - **AI Generate** button: prompt for topic/notes → calls server fn → fills title/excerpt/content via Lovable AI Gateway (`google/gemini-2.5-flash`).
  - **Preview** button → opens `/preview/$slug?token=...` in new tab (works for drafts too, admin-only via auth check).
  - **Save Draft**, **Publish**, **Unpublish** buttons.

## 6. Public site integration
- New server fn `getPublishedPosts()` / `getPublishedPostBySlug()` querying Supabase.
- Homepage, category (`/tag/$slug`), post detail (`/post/$slug`), archive, RSS, sidebar tiles → merge DB published posts with existing static posts (DB takes precedence by slug).
- Drafts never appear in any public list.

## 7. Preview mode
- `/preview/$slug` route — requires admin session; fetches post regardless of status; renders with same template as `/post/$slug` plus a "DRAFT PREVIEW" banner.

## Technical notes
- Server functions in `src/lib/admin.functions.ts` use `requireSupabaseAuth` + `has_role` check; AI generation uses `LOVABLE_API_KEY`.
- Wire `attachSupabaseAuth` in `src/start.ts`.
- Add Bearer-attaching middleware so server fns receive the user token.
- RSS feed route updated to include DB published posts.

## Out of scope
- Multi-author workflows, scheduled publishing, revisions/history, comments.
