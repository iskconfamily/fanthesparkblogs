import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import logoUrl from "@/assets/fts-logo-stamp.png";

type NavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
};

const NAV: NavItem[] = [
  {
    label: "My Journey",
    to: "/my-journey",
    children: [
      { label: "My Story", to: "/my-journey/my-story" },
      { label: "My Guru", to: "/my-journey/my-guru" },
    ],
  },
  {
    label: "Wisdom",
    to: "/wisdom",
    children: [
      { label: "Blog", to: "/wisdom/blog" },
      { label: "Videos", to: "/wisdom/videos" },
      { label: "Audio Playlists", to: "/wisdom/audio-playlists" },
    ],
  },
  {
    label: "Next Steps",
    to: "/next-steps",
    children: [
      { label: "Ask", to: "/next-steps/ask" },
      { label: "Small Groups", to: "/next-steps/small-groups" },
      { label: "Spiritual Retreat", to: "/next-steps/spiritual-retreat" },
    ],
  },
  { label: "Events", to: "/events" },
  {
    label: "Serve",
    to: "/serve",
    children: [
      { label: "Volunteer", to: "/serve/volunteer" },
      { label: "Give", to: "/serve/give" },
      { label: "Transformational Stories", to: "/serve/transformational-stories" },
    ],
  },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function SiteHeaderWeb() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && y > 40) return true;
        if (prev && y < 10) return false;
        return prev;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
  const duration = "320ms";

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        backgroundColor: isScrolled
          ? "var(--brand-header-bg)"
          : "color-mix(in oklab, var(--brand-header-bg) 70%, transparent)",
        backdropFilter: isScrolled ? "saturate(140%) blur(6px)" : "none",
        borderBottom: isScrolled
          ? "1px solid var(--brand-header-border)"
          : "1px solid transparent",
        boxShadow: isScrolled ? "0 1px 10px var(--brand-header-shadow)" : "none",
        transition: `background-color ${duration} ${ease}, border-color ${duration} ${ease}, box-shadow ${duration} ${ease}`,
      }}
    >
      <div
        className="mx-auto flex max-w-[1200px] items-center justify-between px-6"
        style={{
          height: isScrolled ? 64 : 84,
          transition: `height ${duration} ${ease}`,
        }}
      >
        <Link
          to="/"
          aria-label="Fan The Spark — Home"
          className="no-underline flex items-center"
          style={{ borderBottom: "none" }}
        >
          <img
            src={logoUrl}
            alt="Fan The Spark"
            style={{
              height: isScrolled ? 40 : 52,
              width: "auto",
              objectFit: "contain",
              transition: `height ${duration} ${ease}`,
              willChange: "height",
            }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {NAV.map((item) =>
            item.children ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger
                  className="inline-flex items-center gap-1 uppercase whitespace-nowrap outline-none focus-visible:ring-0"
                  style={{
                    fontFamily: "var(--font-meta)",
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    color: "var(--brand-title-color)",
                  }}
                >
                  {item.label}
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  style={{
                    backgroundColor: "var(--brand-header-bg)",
                    border: "1px solid var(--brand-header-border)",
                  }}
                >
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.label} asChild>
                      <Link
                        to={child.to}
                        className="cursor-pointer uppercase"
                        style={{
                          fontFamily: "var(--font-meta)",
                          fontSize: 12,
                          letterSpacing: "0.16em",
                          color: "var(--brand-title-color)",
                          borderBottom: "none",
                        }}
                      >
                        {child.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="uppercase whitespace-nowrap no-underline transition-colors hover:opacity-70"
                style={{
                  fontFamily: "var(--font-meta)",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  color: "var(--brand-title-color)",
                  borderBottom: "none",
                }}
                activeOptions={{ exact: true }}
                activeProps={{
                  style: {
                    fontFamily: "var(--font-meta)",
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    color: "var(--brand-title-color)",
                    borderBottom: "1px solid var(--brand-gold)",
                    paddingBottom: 2,
                  },
                }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="md:hidden inline-flex items-center justify-center p-2 -mr-2"
            aria-label="Open menu"
            style={{ color: "var(--brand-title-color)" }}
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent
            side="right"
            style={{
              backgroundColor: "var(--brand-header-bg)",
              borderLeft: "1px solid var(--brand-header-border)",
            }}
          >
            <nav className="mt-10 flex flex-col gap-6">
              {NAV.flatMap((item) =>
                item.children
                  ? item.children.map((c) => ({
                      label: `${item.label} — ${c.label}`,
                      to: c.to,
                    }))
                  : [{ label: item.label, to: item.to }],
              ).map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="uppercase no-underline"
                  style={{
                    fontFamily: "var(--font-meta)",
                    fontSize: 14,
                    letterSpacing: "0.18em",
                    color: "var(--brand-title-color)",
                    borderBottom: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
