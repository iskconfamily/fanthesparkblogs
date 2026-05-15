import { Link } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/archive", label: "Archive" },
  { to: "/tag/poetry", label: "Poetry" },
  { to: "/tag/books", label: "Books" },
  { to: "/newsletter", label: "Newsletter" },
  { to: "/surprise", label: "Surprise Me" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-[1200px] px-6 pt-10 pb-6 text-center">
        <Link
          to="/"
          className="no-underline inline-block"
          style={{ borderBottom: "none" }}
        >
          <h1
            className="text-5xl md:text-6xl italic tracking-tight"
            style={{ fontFamily: "var(--font-serif-display)", fontWeight: 500 }}
          >
            The Marginalia
          </h1>
        </Link>
        <p
          className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          A literary journal of attention, books, and quiet wonder
        </p>
      </div>
      <nav className="border-t border-border">
        <ul
          className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-x-8 gap-y-2 px-6 py-4 text-[13px] uppercase tracking-[0.18em] no-underline"
          style={{ fontFamily: "var(--font-meta)" }}
        >
          {nav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="text-foreground hover:text-primary"
                style={{ borderBottom: "none" }}
                activeProps={{ style: { color: "var(--color-primary)", borderBottom: "none" } }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
