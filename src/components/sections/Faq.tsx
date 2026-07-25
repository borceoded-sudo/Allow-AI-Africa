"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faq } from "@/lib/content";
import { Panel, PanelInner } from "@/components/layout/Panel";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/atoms";

/**
 * Category tabs filter the list; each row expands its answer with a
 * height/opacity animation and rotates the + into an ×.
 */
export function Faq({ index }: { index: number }) {
  const [category, setCategory] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  const questions = faq.categories[category].questions;

  const selectCategory = (i: number) => {
    setCategory(i);
    setOpen(0);
  };

  return (
    <Panel id="faq" index={index} tone="dark">
      <PanelInner>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Reveal>
            <h2 className="font-display text-[clamp(30px,4.4vw,52px)] leading-none font-normal tracking-[-0.025em]">
              FAQs
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <Button href="#contact" variant="outline">
              Contact Us
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div
            role="tablist"
            aria-label="FAQ categories"
            className="no-scrollbar mt-9 flex gap-2 overflow-x-auto pb-1"
          >
            {faq.categories.map((cat, i) => {
              const selected = i === category;
              return (
                <button
                  key={cat.label}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => selectCategory(i)}
                  className={[
                    "shrink-0 rounded-full border px-4 py-2 font-sans text-[12.5px]",
                    "transition-all duration-300",
                    selected
                      ? "border-ink/70 text-ink bg-white/8"
                      : "text-ink-dim hover:text-ink border-white/12 hover:border-white/30",
                  ].join(" ")}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10 border-t border-white/10">
          {questions.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.05}>
                <div className="border-b border-white/10">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${category}-${i}`}
                      className="group flex w-full items-center gap-5 py-5 text-left"
                    >
                      <span className="text-ink-faint w-7 shrink-0 font-sans text-[12px] tabular-nums">
                        {String(i + 1).padStart(2, "0")}.
                      </span>

                      <span
                        className={[
                          "flex-1 font-sans text-[14.5px] transition-colors duration-300",
                          isOpen ? "text-ink" : "text-ink-dim group-hover:text-ink",
                        ].join(" ")}
                      >
                        {item.q}
                      </span>

                      <span
                        aria-hidden="true"
                        className={[
                          "text-ink-dim group-hover:text-ink relative h-4 w-4 shrink-0",
                          "transition-transform duration-400",
                          isOpen ? "rotate-[135deg]" : "rotate-0",
                        ].join(" ")}
                      >
                        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                        <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${category}-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-ink-dim max-w-[70ch] pt-1 pb-6 pl-12 text-[13.5px] leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </PanelInner>
    </Panel>
  );
}
