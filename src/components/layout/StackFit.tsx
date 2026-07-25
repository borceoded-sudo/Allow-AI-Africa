"use client";

import { useEffect } from "react";

/**
 * Safety net for the sticky panel stack.
 *
 * Panels pin to the top of the viewport so the next one can scroll over them.
 * That only works while a panel fits in a viewport — a taller one would pin
 * with its lower half permanently off-screen and unreachable.
 *
 * This measures every panel and marks the ones that do not fit, which CSS
 * turns back into normal flow. The reveal still reads correctly: the tall
 * panel scrolls up over whatever is pinned behind it, and the panel after it
 * follows immediately, so nothing underneath is ever exposed.
 */
export function StackFit() {
  useEffect(() => {
    const panels = Array.from(
      document.querySelectorAll<HTMLElement>(".stack-item"),
    );
    if (panels.length === 0) return;

    let frame = 0;

    const measure = () => {
      const limit = window.innerHeight;
      for (const panel of panels) {
        // Compare against the panel's natural height, ignoring the sticky
        // offset, and leave a pixel of slack for sub-pixel rounding.
        const tall = panel.offsetHeight > limit + 1;
        if (tall) panel.dataset.tall = "true";
        else delete panel.dataset.tall;
      }
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    schedule();

    window.addEventListener("resize", schedule);

    // Panel heights shift as fonts load and carousels lay out
    const ro = new ResizeObserver(schedule);
    for (const panel of panels) ro.observe(panel);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, []);

  return null;
}
