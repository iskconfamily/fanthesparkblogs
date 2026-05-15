import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Sidebar } from "./sidebar";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="order-2 lg:order-1">
            <Sidebar />
          </div>
          <main className="order-1 lg:order-2 max-w-[720px] w-full">{children}</main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
