import { caseStudies } from "@/lib/content";
import { DotMatrix, variantForIndex } from "@/components/art/DotMatrix";
import { Panel, PanelInner } from "@/components/layout/Panel";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Carousel } from "@/components/ui/Carousel";
import { Button, Eyebrow } from "@/components/ui/atoms";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function CaseStudies({ index }: { index: number }) {
  return (
    <Panel id="case-studies" index={index} tone="paper">
      <PanelInner>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <Eyebrow tone="paper">{caseStudies.eyebrow}</Eyebrow>
          </Reveal>

          <LineReveal
            lines={caseStudies.headline}
            className="font-display mt-6 max-w-[26ch] text-[clamp(24px,3.4vw,40px)] leading-[1.12] font-medium tracking-[-0.025em]"
          />
        </div>

        <div className="mt-12">
          <Carousel
            count={caseStudies.cards.length}
            label="Case studies"
            tone="paper"
            showCounter
            footer={
              <Button
                href="#contact"
                variant="solid"
                className="!bg-ink-dark !text-ink hover:!bg-black"
              >
                View All
              </Button>
            }
          >
            {caseStudies.cards.map((card, i) => (
              <Reveal
                key={card.title}
                delay={i * 0.08}
                className="w-[85vw] shrink-0 snap-start sm:w-[62vw] md:w-[calc((100%-40px)/3)]"
              >
                <article className="group border-hairline-light flex h-full flex-col overflow-hidden rounded-[18px] border bg-white/50 transition-shadow duration-500 hover:shadow-[0_18px_50px_-24px_rgba(11,17,18,0.35)]">
                  <div className="overflow-hidden p-3 pb-0">
                    <div className="aspect-[400/224] overflow-hidden rounded-[12px]">
                      <DotMatrix
                        seed={card.seed}
                        variant={variantForIndex(i)}
                        tone="light"
                        className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-5 pt-5 pb-6">
                    <p className="text-ink-dark-dim font-sans text-[11.5px]">
                      {card.readTime}
                      <span className="mx-1.5">&middot;</span>
                      <time dateTime={card.date}>
                        {dateFormat.format(new Date(card.date))}
                      </time>
                    </p>

                    <h3 className="font-display mt-3 text-[17.5px] leading-[1.25] font-medium tracking-[-0.01em]">
                      {card.title}
                    </h3>

                    <p className="text-ink-dark-dim mt-3 text-[13px] leading-relaxed">
                      {card.excerpt}
                    </p>
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
