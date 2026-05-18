ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS announcement_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS announcement_recipient_count integer;