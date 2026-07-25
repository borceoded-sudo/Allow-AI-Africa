import { programs } from "@/lib/content";
import { Panel, PanelInner } from "@/components/layout/Panel";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Button, Eyebrow } from "@/components/ui/atoms";

const ICONS: Record<string, React.ReactNode> = {
  "01": (
    <path
      d="M10 3.5 3.5 7l6.5 3.5L16.5 7 10 3.5ZM5.5 9.4v3.4c0 1.4 2 2.6 4.5 2.6s4.5-1.2 4.5-2.6V9.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "02": (
    <path
      d="M10 3v5.2M10 8.2 5.6 16.5h8.8L10 8.2ZM7.4 13h5.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "03": (
    <path
      d="M3.5 16.5h13M5 16.5V8.5M9 16.5V8.5M11 16.5V8.5M15 16.5V8.5M10 3 3.5 7h13L10 3Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

/**
 * Bento grid with large ghosted index numerals behind each card — the
 * enterprise-solutions layout from the reference.
 */
export function Programs({ index }: { index: number }) {
  return (
    <Panel id="programs" index={index} tone="dark">
      <PanelInner>
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
          <div>
            <Reveal>
              <Eyebrow>{programs.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-ink-dim mt-8 max-w-[34ch] text-[14px] leading-relaxed">
                {programs.intro}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8">
                <Button href={programs.cta.href} variant="solid">
                  {programs.cta.label}
                </Button>
              </div>
            </Reveal>
          </div>

          <div>
            <LineReveal
              lines={programs.headline}
              className="font-display max-w-[20ch] text-[clamp(24px,3.2vw,38px)] leading-[1.14] font-normal tracking-[-0.02em]"
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {programs.cards.map((card, i) => (
                <Reveal
                  key={card.index}
                  delay={0.1 + i * 0.09}
                  className={i === 0 ? "sm:col-span-2" : ""}
                >
                  <article className="group hover:border-verdigris/25 relative h-full overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.025] p-6 transition-colors duration-500 hover:bg-white/[0.05]">
                    <span
                      aria-hidden="true"
                      className="font-display pointer-events-none absolute right-3 -bottom-5 text-[86px] leading-none font-semibold text-white/[0.045] transition-colors duration-500 group-hover:text-white/[0.075]"
                    >
                      {card.index}
                    </span>

                    <div className="relative flex items-start gap-3.5">
                      <span className="bg-verdigris/12 text-verdigris inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                        <svg
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          className="h-4.5 w-4.5"
                        >
                          {ICONS[card.index]}
                        </svg>
                      </span>

                      <h3 className="font-display flex-1 pt-1.5 text-[19px] font-normal tracking-[-0.01em]">
                        {card.title}
                      </h3>

                      <svg
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        className="text-ink-faint mt-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      >
                        <path
                          d="M4.5 11.5 11.5 4.5M5.6 4.5h5.9v5.9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <p className="text-ink-dim relative mt-4 max-w-[46ch] text-[13.5px] leading-relaxed">
                      {card.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </PanelInner>
    </Panel>
  );
}
