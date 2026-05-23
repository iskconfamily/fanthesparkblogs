import dotsUrl from "@/assets/my-story/dots.png";

export function Dots() {
  return (
    <div className="flex justify-center my-6 sm:my-10">
      <img
        src={dotsUrl}
        alt=""
        aria-hidden="true"
        style={{ height: 14, width: "auto", opacity: 0.85 }}
      />
    </div>
  );
}

export function Para({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-7"
      style={{
        fontFamily: "var(--font-serif-body)",
        fontSize: 19,
        lineHeight: 1.85,
        color: "var(--foreground)",
      }}
    >
      {children}
    </p>
  );
}

export function Prose({
  children,
  tight,
}: {
  children: React.ReactNode;
  tight?: "top" | "bottom" | "both";
}) {
  const pt = tight === "top" || tight === "both" ? "pt-4 sm:pt-8" : "pt-4 sm:pt-10";
  const pb = tight === "bottom" || tight === "both" ? "pb-4 sm:pb-8" : "pb-10 sm:pb-12";
  return (
    <section style={{ backgroundColor: "var(--background)" }}>
      <div className={`mx-auto max-w-[720px] px-6 ${pt} ${pb}`}>{children}</div>
    </section>
  );
}
