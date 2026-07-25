import type { ReactNode } from "react";

type Tone = "dark" | "soft" | "paper";

const TONE: Record<Tone, string> = {
  dark: "bg-panel text-ink",
  soft: "bg-panel-soft text-ink",
  paper: "bg-paper text-ink-dark",
};

/**
 * One section = one rounded panel. Panels stack via `.stack-item` (see
 * globals.css) so the incoming panel scrolls up over the outgoing one and the
 * page background stays visible at the rounded corners.
 *
 * `index` drives z-order: later panels must sit above earlier ones for the
 * reveal to read correctly.
 */
export function Panel({
  id,
  index,
  tone = "dark",
  children,
  className,
  full = true,
}: {
  id?: string;
  index: number;
  tone?: Tone;
  children: ReactNode;
  className?: string;
  full?: boolean;
}) {
  return (
    <section id={id} className="stack-item" style={{ zIndex: index }}>
      <div
        className={[
          "relative overflow-hidden",
          "rounded-[var(--radius-panel)] md:rounded-[var(--radius-panel-lg)]",
          full ? "md:min-h-svh" : "",
          "flex flex-col justify-center",
          TONE[tone],
          className ?? "",
        ].join(" ")}
      >
        {children}
      </div>
    </section>
  );
}

/** Consistent horizontal rhythm inside every panel. */
export function PanelInner({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "mx-auto w-full max-w-[1180px]",
        "px-6 py-16 sm:px-10 md:py-20 lg:px-14",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
