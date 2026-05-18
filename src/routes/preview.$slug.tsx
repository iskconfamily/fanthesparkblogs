import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { PostArticle } from "@/components/post-article";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin, getPreviewPostBySlug } from "@/lib/admin.functions";

export const Route = createFileRoute("/preview/$slug")({
  component: PreviewPage,
});

function PreviewPage() {
  const { slug } = Route.useParams();
  const router = useRouter();
  const [authed, setAuthed] = useState<"checking" | "ok" | "no">("checking");
  const fetchPost = useServerFn(getPreviewPostBySlug);
  const checkAdmin = useServerFn(checkIsAdmin);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.navigate({ to: "/admin/login", search: { redirect: `/preview/${slug}` } });
        return;
      }
      try {
        const { isAdmin } = await checkAdmin();
        if (!isAdmin) {
          router.navigate({ to: "/admin/login", search: { redirect: `/preview/${slug}` } });
          return;
        }
        setAuthed("ok");
      } catch {
        router.navigate({ to: "/admin/login", search: { redirect: `/preview/${slug}` } });
      }
    })();
  }, [slug, router, checkAdmin]);

  const { data: post, isLoading } = useQuery({
    queryKey: ["preview-post", slug],
    queryFn: () => fetchPost({ data: { slug } }),
    enabled: authed === "ok",
  });

  if (authed !== "ok" || isLoading) {
    return <SiteLayout><p className="text-muted-foreground">Loading preview…</p></SiteLayout>;
  }
  if (!post) {
    return <SiteLayout><p className="text-muted-foreground">No post found for "{slug}".</p></SiteLayout>;
  }

  return (
    <SiteLayout>
      <div className="mb-6 px-3 py-2 bg-primary/15 text-primary text-xs uppercase tracking-widest rounded">
        Draft preview — not visible to the public
      </div>
      <article>
        <PostArticle post={post} as="h1" titleClassName="text-4xl md:text-5xl" />
      </article>
    </SiteLayout>
  );
}
