"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { voices } from "@/lib/content";
import { Panel } from "@/components/layout/Panel";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/atoms";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <span
      aria-hidden="true"
      className="from-verdigris-deep font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br to-[#0d2523] text-[15px] font-medium text-white"
    >
      {initials}
    </span>
  );
}

/**
 * Testimonial swapper over an infinite partner marquee. Arrows cross-fade the
 * quote in place rather than moving the page.
 */
export function Voices({ index }: { index: number }) {
  const [active, setActive] = useState(0);
  const list = voices.testimonials;
  const current = list[active];

  const step = (dir: -1 | 1) =>
    setActive((v) => (v + dir + list.length) % list.length);

  const arrowCls =
    "text-ink-dark-dim hover:text-ink-dark inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 hover:bg-black/5";

  return (
    <Panel id="voices" index={index} tone="paper" className="!justify-between">
      <div className="mx-auto w-full max-w-[1180px] px-6 pt-16 pb-10 sm:px-10 md:pt-20 lg:px-14">
        <div className="grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-16">
          <div>
            <Reveal>
              <Eyebrow tone="paper">{voices.eyebrow}</Eyebrow>
            </Reveal>

            <LineReveal
              lines={voices.headline}
              className="font-display mt-6 max-w-[15ch] text-[clamp(25px,3.6vw,42px)] leading-[1.1] font-medium tracking-[-0.025em]"
            />

            <Reveal delay={0.25}>
              <div className="mt-10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous testimonial"
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
                <span className="text-ink-dark-dim font-sans text-[13px] tabular-nums">
                  {active + 1} / {list.length}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next testimonial"
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
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <figure className="relative min-h-[260px]">
              <span
                aria-hidden="true"
                className="font-display text-verdigris-deep/35 block text-[64px] leading-[0.5] select-none"
              >
                &rdquo;
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-7"
                >
                  <blockquote className="font-display max-w-[42ch] text-[clamp(17px,1.9vw,22px)] leading-[1.45] font-normal tracking-[-0.01em]">
                    {current.quote}
                  </blockquote>

                  <figcaption className="mt-8 flex items-center gap-3.5">
                    <Avatar name={current.name} />
                    <span>
                      <span className="font-display block text-[15px] font-medium">
                        {current.name}
                      </span>
                      <span className="text-ink-dark-dim block text-[12.5px]">
                        {current.role}
                      </span>
                    </span>
                  </figcaption>
                </motion.div>
              </AnimatePresence>
            </figure>
          </Reveal>
        </div>
      </div>

      {/* Infinite logo marquee — the band is duplicated so the loop is seamless */}
      <div
        className="relative overflow-hidden py-8"
        aria-label="Selected partners"
      >
        <div className="from-paper pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent" />
        <div className="from-paper pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l to-transparent" />

        <ul className="animate-marquee flex w-max items-center gap-16 pr-16">
          {[...voices.partners, ...voices.partners].map((partner, i) => (
            <li
              key={`${partner}-${i}`}
              aria-hidden={i >= voices.partners.length}
              className="font-display text-ink-dark/35 hover:text-ink-dark/70 shrink-0 text-[17px] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-500"
            >
              {partner}
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
