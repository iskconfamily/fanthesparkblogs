import { createFileRoute, Outlet, redirect, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login" || location.pathname === "/admin/setup") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/admin/login" });
    }
    try {
      const { isAdmin } = await checkIsAdmin();
      if (!isAdmin) throw redirect({ to: "/admin/login" });
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminShell,
});

function AdminShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="text-lg italic" style={{ fontFamily: "var(--font-serif-display)" }}>
            Admin
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/admin">Posts</Link>
            <Link to="/admin/new">New</Link>
            <Link to="/">View site</Link>
            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/admin/login";
              }}
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
