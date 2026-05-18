import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/fts-logo-stamp.png";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
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

  const headerHeight = isScrolled ? (isMobile ? 56 : 62) : 124;
  const logoSize = isScrolled ? (isMobile ? 34 : 40) : 64;

  // Approximate offset of the logo from horizontal center when in the
  // top/expanded state — places it just to the left of the centered title.
  // Title "Fan The Spark Blogs" at this size measures ~360–400px wide.
  const titleHalf = isMobile ? 150 : 200;
  const gap = 16;
  const expandedLogoLeft = `calc(50% - ${titleHalf + gap + 64 / 2}px)`;
  const scrolledLogoLeft = isMobile ? 20 : 28;

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        height: headerHeight,
        backgroundColor: "#faf6ee",
        borderBottom: "1px solid rgba(217, 167, 78, 0.22)",
        transition: `height ${duration} ${ease}, box-shadow ${duration} ${ease}`,
        boxShadow: isScrolled ? "0 1px 10px rgba(126, 108, 42, 0.07)" : "none",
      }}
    >
      <div className="relative mx-auto h-full max-w-[1200px]">
        <Link
          to="/"
          aria-label="Fan The Spark — Home"
          className="no-underline absolute inset-0 block"
          style={{ borderBottom: "none" }}
        >
          {/* Single shared logo — translates + scales between states */}
          <img
            src={logoUrl}
            alt="Fan The Spark"
            style={{
              position: "absolute",
              top: "50%",
              left: isScrolled ? scrolledLogoLeft : expandedLogoLeft,
              width: logoSize,
              height: logoSize,
              transform: "translateY(-50%)",
              objectFit: "contain",
              transition: `left ${duration} ${ease}, width ${duration} ${ease}, height ${duration} ${ease}`,
              willChange: "left, width, height",
            }}
          />

          {/* Title — centered at top, fades out on scroll */}
          <h1
            className="text-2xl md:text-3xl whitespace-nowrap"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-serif-display)",
              fontWeight: 600,
              fontVariant: "small-caps",
              letterSpacing: "0.08em",
              color: "var(--brand-olive)",
              margin: 0,
              pointerEvents: isScrolled ? "none" : "auto",
              opacity: isScrolled ? 0 : 1,
              transition: `opacity ${isScrolled ? "200ms" : "320ms"} ${ease}`,
            }}
          >
            Fan The Spark Blogs
          </h1>
        </Link>
      </div>
    </header>
  );
}
