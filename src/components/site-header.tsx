import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/fts-logo-stamp.png";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && y > 80) return true;
        if (prev && y < 20) return false;
        return prev;
      });
    };
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onScroll();
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
  const duration = "380ms";

  const headerHeight = isScrolled ? (isMobile ? 56 : 64) : 124;
  const logoHeight = isScrolled ? (isMobile ? 32 : 40) : isMobile ? 56 : 72;

  const scrolledLogoLeft = isMobile ? 20 : 28;

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        height: headerHeight,
        backgroundColor: "var(--brand-header-bg)",
        borderBottom: "1px solid var(--brand-header-border)",
        transition: `height ${duration} ${ease}, box-shadow ${duration} ${ease}`,
        boxShadow: isScrolled ? "0 1px 10px var(--brand-header-shadow)" : "none",
      }}
    >
      <div className="relative mx-auto h-full max-w-[1200px]">
        <Link
          to="/"
          aria-label="Fan The Spark — Home"
          className="no-underline absolute inset-0 block"
          style={{ borderBottom: "none" }}
        >
          <img
            src={logoUrl}
            alt="Fan The Spark"
            style={{
              position: "absolute",
              top: "50%",
              left: isScrolled ? `${scrolledLogoLeft}px` : "50%",
              height: logoHeight,
              width: "auto",
              transform: isScrolled
                ? "translate(0, -50%)"
                : "translate(-50%, -50%)",
              objectFit: "contain",
              transition: `left ${duration} ${ease}, height ${duration} ${ease}, transform ${duration} ${ease}`,
              willChange: "left, height, transform",
            }}
          />
        </Link>
      </div>
    </header>
  );
}
