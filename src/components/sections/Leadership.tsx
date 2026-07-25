import { leadership } from "@/lib/content";
import { GradientFlow } from "@/components/art/GradientFlow";
import { Panel, PanelInner } from "@/components/layout/Panel";
import { LineReveal, WordReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/atoms";

/** Initials monogram — stands in for a portrait without inventing a likeness. */
function Monogram({ name }: { name: string }) {
  const initials = name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <span
      aria-hidden="true"
      className="font-display text-ink/85 text-[clamp(44px,7vw,76px)] leading-none font-medium tracking-[-0.03em]"
    >
      {initials}
    </span>
  );
}

export function Leadership({ index }: { index: number }) {
  return (
    <Panel id="company" index={index} tone="paper">
      <PanelInner>
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
          <div>
            <Reveal>
              <Eyebrow tone="paper">{leadership.eyebrow}</Eyebrow>
            </Reveal>

            <LineReveal
              lines={leadership.headline}
              className="font-display mt-6 max-w-[16ch] text-[clamp(24px,3.4vw,40px)] leading-[1.12] font-medium tracking-[-0.025em]"
            />
          </div>

          <div className="flex items-end">
            <WordReveal
              text={leadership.body}
              className="text-ink-dark-dim max-w-[48ch] text-[15px] leading-relaxed"
            />
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {leadership.people.map((person, i) => (
            <Reveal key={person.name} delay={0.12 + i * 0.12}>
              <article className="group grid h-full overflow-hidden rounded-[18px] border border-hairline-light sm:grid-cols-[1fr_0.85fr]">
                <div className="bg-ink-dark relative flex min-h-[210px] flex-col justify-between p-6">
                  <GradientFlow
                    seed={person.seed}
                    intensity={0.7}
                    className="absolute inset-0"
                  />
                  <div className="relative">
                    <p className="text-ink/55 font-sans text-[10.5px] tracking-[0.18em] uppercase">
                      {person.role}
                    </p>
                    <p className="font-display text-ink mt-2 text-[19px] font-normal">
                      {person.name}
                    </p>
                  </div>
                  <p className="text-ink/60 relative max-w-[30ch] text-[12.5px] leading-snug">
                    {person.note}
                  </p>
                </div>

                <div className="flex min-h-[210px] items-center justify-center bg-gradient-to-br from-[#1b2a29] to-[#0a0f10] transition-transform duration-700 group-hover:scale-[1.02]">
                  <Monogram name={person.name} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </PanelInner>
    </Panel>
  );
}
