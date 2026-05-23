import { SiteHeaderMarketing } from "./site-header-marketing";
import { SiteFooter } from "./site-footer";

export function SiteLayoutMarketing({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeaderMarketing />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
