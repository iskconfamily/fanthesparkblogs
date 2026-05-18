import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { resolveTheme, DEFAULT_THEME } from "@/styles/themes";

/**
 * Reads `?style=styleN` from the current URL and applies it as
 * `<html data-style="styleN">`. Falls back to the default theme.
 * Re-runs on every route/search change.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const location = useRouterState({ select: (s) => s.location });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const search = location.search as Record<string, unknown> | undefined;
    const raw =
      (search && typeof search.style === "string" ? (search.style as string) : null) ??
      new URLSearchParams(window.location.search).get("style");
    const theme = resolveTheme(raw);
    document.documentElement.dataset.style = theme;
  }, [location.search, location.pathname]);

  // SSR-safe default so first paint matches.
  if (typeof document === "undefined") {
    // no-op; the html shell sets nothing, :root vars already match style1
  }

  return <>{children}</>;
}

export { DEFAULT_THEME };
