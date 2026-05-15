import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site-layout";
import { ArticleBody } from "@/components/article-body";
import { Byline } from "@/components/byline";
import { formatDate } from "@/content/queries";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin, getPreviewPostBySlug } from "@/lib/admin.functions";

export const Route = createFileRoute("/preview/$slug")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/admin/login" });
    try {
      const { isAdmin } = await checkIsAdmin();
      if (!isAdmin) throw redirect({ to: "/admin/login" });
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: PreviewPage,
});

function PreviewPage() {
  const { slug } = Route.useParams();
  const fetchPost = useServerFn(getPreviewPostBySlug);
  const { data: post, isLoading } = useQuery({
    queryKey: ["preview-post", slug],
    queryFn: () => fetchPost({ data: { slug } }),
  });

  if (isLoading) {
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
        <h1 className="text-4xl md:text-5xl italic leading-[1.1]" style={{ fontFamily: "var(--font-serif-display)" }}>
          {post.title}
        </h1>
        <p
          className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          {formatDate(post.date)}
        </p>
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
