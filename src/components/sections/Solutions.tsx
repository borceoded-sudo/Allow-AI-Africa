import { solutions } from "@/lib/content";
import { DotMatrix, variantForIndex } from "@/components/art/DotMatrix";
import { Panel, PanelInner } from "@/components/layout/Panel";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Carousel } from "@/components/ui/Carousel";
import { ArrowLink, Eyebrow } from "@/components/ui/atoms";

export function Solutions({ index }: { index: number }) {
  return (
    <Panel id="solutions" index={index} tone="dark">
      <PanelInner>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <Eyebrow>Our Solutions</Eyebrow>
          </Reveal>

          <LineReveal
            lines={[
              "Four ways to put machine learning",
              "to work in an African market",
            ]}
            className="font-display mt-6 max-w-[22ch] text-[clamp(24px,3.5vw,42px)] leading-[1.14] font-normal tracking-[-0.02em]"
          />
        </div>

        <div className="mt-10">
          <Carousel count={solutions.length} label="Solutions">
            {solutions.map((item, i) => (
              <Reveal
                key={item.index}
                delay={i * 0.08}
                className="w-[85vw] shrink-0 snap-start sm:w-[62vw] md:w-[calc((100%-40px)/3)]"
              >
                <article className="group hover:border-white/22 flex h-full flex-col overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.02] transition-colors duration-500 hover:bg-white/[0.045]">
                  <div className="relative aspect-[400/224] overflow-hidden">
                    <DotMatrix
                      seed={item.seed}
                      variant={variantForIndex(i)}
                      className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="text-ink-dim absolute top-3.5 right-4 font-sans text-[11px] tabular-nums">
                      / {item.index}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-6 pt-6 pb-5 text-center">
                    <h3 className="font-display inline-flex items-center justify-center gap-1.5 text-[21px] font-normal tracking-[-0.015em]">
                      {item.title}
                      <svg
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
                    </h3>

                    <p className="text-ink-dim mx-auto mt-3 max-w-[34ch] text-[13.5px] leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="mt-5 border-t border-white/8 pt-4">
                      <ArrowLink href="#contact">Learn more</ArrowLink>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </Carousel>
        </div>
      </PanelInner>
    </Panel>
  );
}
