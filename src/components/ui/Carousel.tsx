"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Scroll-snap carousel with arrow paging and a live index counter — the
 * products / case-studies mechanic from the reference walkthrough.
 *
 * Uses native scroll rather than a transformed track so touch drag, keyboard
 * and screen readers all work without extra wiring.
 */
export function Carousel({
  children,
  count,
  tone = "dark",
  label,
  showCounter = false,
  footer,
}: {
  children: React.ReactNode;
  count: number;
  tone?: "dark" | "paper";
  label: string;
  showCounter?: boolean;
  footer?: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.firstElementChild as HTMLElement | null;
    if (!child) return;

    const step = child.offsetWidth + 20;
    setActive(Math.min(count - 1, Math.round(el.scrollLeft / step)));
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  }, [count]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const page = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.firstElementChild as HTMLElement | null;
    if (!child) return;
    el.scrollBy({ left: dir * (child.offsetWidth + 20), behavior: "smooth" });
  };

  const arrowCls = [
    "inline-flex h-9 w-9 items-center justify-center rounded-full",
    "transition-all duration-300 disabled:opacity-25 disabled:cursor-default",
    tone === "dark"
      ? "text-ink-dim hover:text-ink hover:bg-white/8"
      : "text-ink-dark-dim hover:text-ink-dark hover:bg-black/5",
  ].join(" ");

  return (
    <div>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-2"
      >
        {children}
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={atStart}
          aria-label="Previous"
          className={arrowCls}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path
              d="M12 4 6 10l6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {showCounter && (
          <div className="flex flex-col items-center gap-2">
            <span
              className={[
                "font-sans text-[13px] tabular-nums",
                tone === "dark" ? "text-ink-dim" : "text-ink-dark-dim",
              ].join(" ")}
              aria-live="polite"
            >
              {active + 1}/{count}
            </span>
            <span
              className={[
                "block h-px w-24",
                tone === "dark" ? "bg-white/18" : "bg-black/15",
              ].join(" ")}
            >
              <span
                className={[
                  "block h-px transition-all duration-500",
                  tone === "dark" ? "bg-ink" : "bg-ink-dark",
                ].join(" ")}
                style={{ width: `${((active + 1) / count) * 100}%` }}
              />
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => page(1)}
          disabled={atEnd}
          aria-label="Next"
          className={arrowCls}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path
              d="M8 4l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {footer ? <div className="mt-8 flex justify-center">{footer}</div> : null}
    </div>
  );
}
