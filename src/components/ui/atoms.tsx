import type { ReactNode } from "react";

/** The small outlined pill that labels every section. */
export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "paper";
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3.5 py-1.5",
        "font-sans text-[11px] tracking-[0.14em] uppercase",
        tone === "dark"
          ? "border-verdigris/35 text-verdigris"
          : "border-verdigris-deep/40 text-verdigris-deep",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

const ARROW = (
  <svg
    viewBox="0 0 16 16"
    aria-hidden="true"
    className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
  >
    <path
      d="M2.5 8h10M9 4.5 12.5 8 9 11.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Primary pill button. `solid` on paper panels, `outline` on dark ones. */
export function Button({
  href,
  children,
  variant = "solid",
  className,
  type,
  disabled,
}: {
  href?: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "gold";
  className?: string;
  type?: "submit" | "button";
  disabled?: boolean;
}) {
  const base = [
    "group inline-flex items-center gap-2.5 rounded-full",
    "px-5 py-2.5 font-sans text-sm font-medium",
    "transition-all duration-300 disabled:opacity-55 disabled:pointer-events-none",
  ];

  const variants = {
    solid: "bg-ink text-ink-dark hover:bg-white",
    outline:
      "border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/5",
    gold: "bg-gold text-ink-dark hover:bg-gold-soft",
  };

  const cls = [...base, variants[variant], className ?? ""].join(" ");

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
        {ARROW}
      </a>
    );
  }

  return (
    <button type={type ?? "button"} className={cls} disabled={disabled}>
      {children}
      {ARROW}
    </button>
  );
}

/** Understated "Learn more ›" affordance used on cards. */
export function ArrowLink({
  href = "#contact",
  children,
  tone = "dark",
  className,
}: {
  href?: string;
  children: ReactNode;
  tone?: "dark" | "paper";
  className?: string;
}) {
  return (
    <a
      href={href}
      className={[
        "group inline-flex items-center gap-1.5 font-sans text-sm",
        "underline-offset-[6px] transition-colors duration-300",
        tone === "dark"
          ? "text-ink-dim hover:text-ink decoration-ink/25 hover:decoration-ink/60"
          : "text-ink-dark-dim hover:text-ink-dark decoration-ink-dark/20",
        "underline",
        className ?? "",
      ].join(" ")}
    >
      {children}
      {ARROW}
    </a>
  );
}

/**
 * The Allow AI Africa mark: a stacked-dot glyph (a nod to the halftone
 * artwork) beside the wordmark, matching the lockup style of the reference.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "paper";
  className?: string;
}) {
  const ink = tone === "dark" ? "text-ink" : "text-ink-dark";

  return (
    <a
      href="#top"
      aria-label="Allow AI Africa — back to top"
      className={`inline-flex items-center gap-2.5 ${ink} ${className ?? ""}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <g fill="currentColor">
          <circle cx="12" cy="4" r="2.1" />
          <circle cx="5.4" cy="9.6" r="1.7" opacity="0.75" />
          <circle cx="18.6" cy="9.6" r="1.7" opacity="0.75" />
          <circle cx="7.6" cy="17.6" r="1.35" opacity="0.5" />
          <circle cx="16.4" cy="17.6" r="1.35" opacity="0.5" />
          <circle cx="12" cy="12.6" r="1.1" opacity="0.35" />
        </g>
      </svg>
      <span className="font-display text-[17px] leading-none font-semibold tracking-[-0.01em]">
        Allow<span className="text-verdigris">AI</span>
        <span className="ml-1 font-normal">Africa</span>
      </span>
    </a>
  );
}
