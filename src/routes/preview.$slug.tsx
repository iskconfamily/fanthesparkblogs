import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { ArticleBody } from "@/components/article-body";
import { Byline } from "@/components/byline";
import { formatDate } from "@/content/queries";
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
        <div
          className="mb-8 px-6 py-7 md:px-10 md:py-8"
          style={{ backgroundColor: "#f7efe3", borderRadius: "3px" }}
        >
          <h1
            className="text-4xl md:text-5xl italic leading-[1.1]"
            style={{ fontFamily: "var(--font-serif-display)", color: "#7e6c2a" }}
          >
            {post.title}
          </h1>
          <p
            className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground"
            style={{ fontFamily: "var(--font-meta)" }}
          >
            {formatDate(post.date)}
          </p>
        </div>
        <Byline author={post.author} />
        {post.featuredImage.src && (
          <figure className="my-8">
            <img src={post.featuredImage.src} alt={post.featuredImage.alt} className="w-full" />
          </figure>
        )}
        <ArticleBody blocks={post.body} />
      </article>
    </SiteLayout>
  );
}
