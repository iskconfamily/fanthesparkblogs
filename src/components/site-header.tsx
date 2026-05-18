import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/fts-logo-stamp.png";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerHeight = isScrolled ? 52 : 124;
  const logoSize = isScrolled ? 28 : 64;
  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        height: headerHeight,
        backgroundColor: "#faf6ee",
        borderBottom: "1px solid rgba(217, 167, 78, 0.25)",
        transition: `height 320ms ${ease}`,
        boxShadow: isScrolled ? "0 1px 8px rgba(126, 108, 42, 0.06)" : "none",
      }}
    >
      <div className="relative mx-auto h-full max-w-[1200px]">
        <Link
          to="/"
          aria-label="Fan The Spark — Home"
          className="no-underline absolute inset-0"
          style={{ borderBottom: "none" }}
        >
          {/* Centered lockup container — fades out on scroll */}
          <div
            className="absolute inset-0 flex items-center justify-center gap-4 px-6"
            style={{
              opacity: isScrolled ? 0 : 1,
              visibility: isScrolled ? "hidden" : "visible",
              transition: isScrolled
                ? `opacity 200ms ${ease}, visibility 0s linear 200ms`
                : `opacity 260ms ${ease} 80ms, visibility 0s linear 0s`,
            }}
          >
            <img
              src={logoUrl}
              alt=""
              style={{ width: 64, height: 64, objectFit: "contain" }}
            />
            <h1
              className="text-2xl md:text-3xl whitespace-nowrap"
              style={{
                fontFamily: "var(--font-serif-display)",
                fontWeight: 600,
                fontVariant: "small-caps",
                letterSpacing: "0.08em",
                color: "var(--brand-olive)",
                margin: 0,
              }}
            >
              Fan The Spark Blogs
            </h1>
          </div>

          {/* Compact left-aligned logo — fades in on scroll */}
          <img
            src={logoUrl}
            alt="Fan The Spark"
            style={{
              position: "absolute",
              top: "50%",
              left: 24,
              width: logoSize,
              height: logoSize,
              transform: "translateY(-50%)",
              objectFit: "contain",
              opacity: isScrolled ? 1 : 0,
              visibility: isScrolled ? "visible" : "hidden",
              transition: isScrolled
                ? `opacity 260ms ${ease} 80ms, width 320ms ${ease}, height 320ms ${ease}, visibility 0s linear 0s`
                : `opacity 180ms ${ease}, visibility 0s linear 180ms`,
            }}
          />
        </Link>
      </div>
    </header>
  );
}
