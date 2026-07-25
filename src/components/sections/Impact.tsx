import { impact } from "@/lib/content";
import { Panel, PanelInner } from "@/components/layout/Panel";
import { CountUp } from "@/components/motion/CountUp";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/atoms";

/**
 * Proof-point band. Figures count up as the section enters and the grid
 * assembles in a stagger rather than appearing at once.
 */
export function Impact({ index }: { index: number }) {
  return (
    <Panel id="impact" index={index} tone="soft">
      <PanelInner>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <Eyebrow>{impact.eyebrow}</Eyebrow>
            </Reveal>

            <LineReveal
              lines={impact.headline}
              className="font-display mt-6 max-w-[18ch] text-[clamp(24px,3.2vw,38px)] leading-[1.14] font-normal tracking-[-0.02em]"
            />
          </div>

          <Reveal delay={0.2}>
            <p className="text-ink-faint max-w-[30ch] text-[13px] leading-relaxed">
              Reported annually and audited by an independent third party.
            </p>
          </Reveal>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 md:mt-12">
          {impact.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.07}>
              <div>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-display block text-[clamp(34px,5vw,60px)] leading-[0.94] font-medium tracking-[-0.035em] tabular-nums"
                  />
                  <span className="text-ink-dim mt-3 block max-w-[22ch] text-[13px] leading-snug">
                    {stat.label}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </PanelInner>
    </Panel>
  );
}
