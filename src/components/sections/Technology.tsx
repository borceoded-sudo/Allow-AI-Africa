"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { technology } from "@/lib/content";
import { DotMatrix, variantForIndex } from "@/components/art/DotMatrix";
import { Panel, PanelInner } from "@/components/layout/Panel";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Button, Eyebrow } from "@/components/ui/atoms";

/**
 * Tabbed selector: picking a row on the left cross-fades the artwork and copy
 * on the right, with an n/4 counter tracking position.
 */
export function Technology({ index }: { index: number }) {
  const [active, setActive] = useState(0);
  const items = technology.items;
  const current = items[active];

  return (
    <Panel id="technology" index={index} tone="soft">
      <PanelInner>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <Reveal>
              <Eyebrow>{technology.eyebrow}</Eyebrow>
            </Reveal>

            <LineReveal
              lines={technology.headline}
              className="font-display mt-6 max-w-[18ch] text-[clamp(24px,3.2vw,38px)] leading-[1.14] font-normal tracking-[-0.02em]"
            />

            <Reveal delay={0.2}>
              <div className="mt-8">
                <Button href="#contact" variant="outline">
                  Contact Us
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-12">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-ink-dim font-sans text-[13px]">
                    Select an item
                  </span>
                  <span className="text-ink-dim font-sans text-[13px] tabular-nums">
                    {active + 1}/{items.length}
                  </span>
                </div>

                <ul role="tablist" aria-label="Technology areas" className="space-y-1.5">
                  {items.map((item, i) => {
                    const selected = i === active;
                    return (
                      <li key={item.title}>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          aria-controls="tech-panel"
                          onClick={() => setActive(i)}
                          className={[
                            "flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left",
                            "transition-all duration-400",
                            selected
                              ? "border-verdigris/30 bg-gradient-to-r from-white/8 to-transparent border"
                              : "border border-transparent hover:bg-white/4",
                          ].join(" ")}
                        >
                          <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                            <DotMatrix
                              seed={item.seed}
                              variant={variantForIndex(i)}
                              className="h-full w-full"
                            />
                          </span>

                          <span
                            className={[
                              "flex-1 font-sans text-[14.5px] transition-colors duration-300",
                              selected ? "text-ink" : "text-ink-dim",
                            ].join(" ")}
                          >
                            {item.title}
                          </span>

                          {selected && (
                            <motion.span
                              layoutId="tech-dot"
                              className="bg-verdigris h-1.5 w-1.5 rounded-full"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="flex">
            <div
              id="tech-panel"
              role="tabpanel"
              className="relative flex w-full flex-col gap-4"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] border border-white/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.title}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <DotMatrix
                      seed={current.seed}
                      variant={variantForIndex(active)}
                      className="h-full w-full"
                    />
                  </motion.div>
                </AnimatePresence>

                <span className="text-ink-dim absolute top-4 left-5 font-sans text-[11px] tabular-nums">
                  / {String(active + 1).padStart(3, "0")}
                </span>
              </div>

              <div className="min-h-[168px] rounded-[18px] border border-white/10 bg-white/[0.02] p-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h3 className="font-display text-[24px] font-normal tracking-[-0.015em]">
                      {current.title}
                    </h3>
                    <p className="text-ink-dim mt-3 max-w-[52ch] text-[14px] leading-relaxed">
                      {current.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </PanelInner>
    </Panel>
  );
}
