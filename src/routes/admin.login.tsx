import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { hasAnyAdmin } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/login")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);

  useEffect(() => {
    hasAnyAdmin().then((r) => setNeedsBootstrap(!r.hasAdmin)).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (redirect && redirect.startsWith("/")) {
      window.location.href = redirect;
    } else {
      router.navigate({ to: "/admin" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl italic mb-6" style={{ fontFamily: "var(--font-serif-display)" }}>
          Admin sign in
        </h1>
        {needsBootstrap && (
          <div className="mb-4 p-3 border border-border rounded text-sm">
            No admin yet.{" "}
            <Link to="/admin/setup" className="underline">
              Create the first admin
            </Link>
            .
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Email</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Password</label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
