import { SiteHeaderWeb } from "./site-header-web";
import { SiteFooter } from "./site-footer";

export function SiteLayoutWeb({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeaderWeb />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
