
ALTER FUNCTION public.set_updated_at() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon, authenticated, public;

DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
-- Public read by direct URL still works for public buckets even without a SELECT policy.
-- We just don't add a broad SELECT policy that would allow listing.
