
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS blocks jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Backfill blocks from existing content + featured image for any row where blocks is still empty.
DO $$
DECLARE
  r RECORD;
  chunks text[];
  chunk text;
  out_blocks jsonb;
  blk jsonb;
  fig_match text[];
  inserted_image boolean;
  first_para_seen boolean;
  layout text;
BEGIN
  FOR r IN SELECT id, content, featured_image, image_layout FROM public.blog_posts WHERE blocks = '[]'::jsonb LOOP
    out_blocks := '[]'::jsonb;
    inserted_image := false;
    first_para_seen := false;
    layout := COALESCE(r.image_layout, 'hero');

    -- For side layout: insert side-right image at the very top so it floats next to first paragraphs.
    IF r.featured_image IS NOT NULL AND r.featured_image <> '' AND layout = 'side' THEN
      out_blocks := out_blocks || jsonb_build_object(
        'id', gen_random_uuid()::text,
        'type', 'image',
        'src', r.featured_image,
        'alt', '',
        'layout', 'side-right'
      );
      inserted_image := true;
    END IF;

    IF r.content IS NOT NULL THEN
      chunks := regexp_split_to_array(r.content, E'\n\\s*\n');
      FOREACH chunk IN ARRAY chunks LOOP
        chunk := btrim(chunk);
        CONTINUE WHEN chunk = '';

        IF chunk LIKE '## %' THEN
          blk := jsonb_build_object('id', gen_random_uuid()::text, 'type', 'heading', 'level', 2, 'text', btrim(substring(chunk from 4)));
        ELSIF chunk LIKE '> %' THEN
          blk := jsonb_build_object('id', gen_random_uuid()::text, 'type', 'quote', 'text', btrim(substring(chunk from 3)));
        ELSE
          fig_match := regexp_match(chunk, '^!\[([^\]]*)\]\(([^)]+)\)$');
          IF fig_match IS NOT NULL THEN
            blk := jsonb_build_object('id', gen_random_uuid()::text, 'type', 'image', 'src', fig_match[2], 'alt', COALESCE(fig_match[1], ''), 'layout', 'full');
          ELSE
            blk := jsonb_build_object('id', gen_random_uuid()::text, 'type', 'paragraph', 'text', chunk);
            -- For hero layout: after first paragraph, insert the featured image.
            IF NOT inserted_image AND NOT first_para_seen AND layout = 'hero' AND r.featured_image IS NOT NULL AND r.featured_image <> '' THEN
              out_blocks := out_blocks || blk;
              out_blocks := out_blocks || jsonb_build_object(
                'id', gen_random_uuid()::text,
                'type', 'image',
                'src', r.featured_image,
                'alt', '',
                'layout', 'hero'
              );
              first_para_seen := true;
              inserted_image := true;
              CONTINUE;
            END IF;
            first_para_seen := true;
          END IF;
        END IF;
        out_blocks := out_blocks || blk;
      END LOOP;
    END IF;

    -- If layout is 'hero' but we never saw a paragraph, append image at end.
    IF NOT inserted_image AND layout = 'hero' AND r.featured_image IS NOT NULL AND r.featured_image <> '' THEN
      out_blocks := out_blocks || jsonb_build_object(
        'id', gen_random_uuid()::text,
        'type', 'image',
        'src', r.featured_image,
        'alt', '',
        'layout', 'hero'
      );
    END IF;

    UPDATE public.blog_posts SET blocks = out_blocks WHERE id = r.id;
  END LOOP;
END $$;
