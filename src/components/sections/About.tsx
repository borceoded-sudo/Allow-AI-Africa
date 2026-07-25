"use client";

import { motion, useReducedMotion } from "motion/react";
import { about } from "@/lib/content";
import { Panel } from "@/components/layout/Panel";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/LineReveal";
import { GradientFlow } from "@/components/art/GradientFlow";
import { Eyebrow } from "@/components/ui/atoms";

/**
 * The signature moment: an oversized wordmark spanning the full panel width
 * that scales and settles into place as the panel arrives, book-ended later by
 * the footer.
 */
function Wordmark() {
  const reduce = useReducedMotion();

  const inner = (
    <span className="font-display block text-center text-[clamp(38px,12.2vw,168px)] leading-[0.86] font-semibold tracking-[-0.045em] whitespace-nowrap">
      Allow<span className="text-verdigris-deep">AI</span>Africa
    </span>
  );

  if (reduce) return inner;

  return (
    <motion.div
      initial={{ scale: 1.1, opacity: 0, y: 18 }}
      whileInView={{ scale: 1, opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {inner}
    </motion.div>
  );
}

export function About({ index }: { index: number }) {
  return (
    <Panel id="about" index={index} tone="paper">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-16 sm:px-10 md:py-20 lg:px-14">
        <Wordmark />

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="text-ink-dark-dim font-sans text-[13px] tabular-nums">
                  {about.index}
                </span>
                <Eyebrow tone="paper">{about.eyebrow}</Eyebrow>
              </div>
            </Reveal>

            <WordReveal
              text={about.title}
              className="font-display mt-6 max-w-[20ch] text-[clamp(22px,2.9vw,34px)] leading-[1.18] font-medium tracking-[-0.02em]"
            />

            <Reveal delay={0.15}>
              <p className="text-ink-dark-dim mt-6 max-w-[52ch] text-[15px] leading-relaxed">
                {about.body}
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <dl className="mt-10 grid grid-cols-3 gap-4">
                {about.pillars.map((p) => (
                  <div key={p.label} className="rule-light pb-4">
                    <dt className="font-display text-[16px] font-medium">
                      {p.label}
                    </dt>
                    <dd className="text-ink-dark-dim mt-1 text-[12.5px] leading-snug">
                      {p.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="flex">
            <div className="relative w-full overflow-hidden rounded-[20px] bg-ink-dark p-8 sm:p-10">
              <GradientFlow
                seed={9}
                intensity={0.85}
                className="absolute inset-0"
              />
              <div className="relative">
                <p className="text-verdigris font-sans text-[11px] tracking-[0.2em] uppercase">
                  {about.mission.label}
                </p>
                <p className="font-display text-ink mt-5 max-w-[26ch] text-[clamp(19px,2.3vw,27px)] leading-[1.28] font-normal tracking-[-0.015em]">
                  {about.mission.text}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Panel>
  );
}
