import { hero, site } from "@/lib/content";
import { HalftoneField } from "@/components/art/HalftoneField";
import { Panel } from "@/components/layout/Panel";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/atoms";
import { SocialIcons } from "@/components/ui/SocialIcons";

/**
 * Hero panel: an animated halftone field on top, with the headline block on a
 * paper slab beneath it — the split the reference site opens with.
 */
export function Hero({ index }: { index: number }) {
  return (
    <Panel id="top" index={index} tone="paper" className="!justify-start">
      <div className="relative h-[46svh] min-h-[300px] w-full md:h-[52svh]">
        <HalftoneField className="absolute inset-0 h-full w-full" />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent">
          <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-end justify-between gap-6 px-6 pb-7 sm:px-10 lg:px-14">
            <Reveal delay={0.35}>
              <p className="font-display text-ink max-w-[16ch] text-[clamp(18px,2.4vw,26px)] leading-[1.22]">
                {hero.caption}
              </p>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="flex flex-col items-start gap-2.5 sm:items-end">
                <p className="text-ink/70 text-[12px]">
                  {site.socials.length > 0 ? "Quick contact with us!" : null}
                </p>
                <SocialIcons tone="onDark" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1180px] px-6 py-12 sm:px-10 md:py-16 lg:px-14">
        <Reveal delay={0.05}>
          <span className="border-verdigris-deep/35 text-verdigris-deep inline-flex rounded-full border px-4 py-1.5 text-[12px]">
            {hero.eyebrow}
          </span>
        </Reveal>

        <LineReveal
          as="h1"
          lines={hero.headline}
          delay={0.12}
          className="font-display mt-7 max-w-[19ch] text-[clamp(30px,5.4vw,60px)] leading-[1.06] font-medium tracking-[-0.025em]"
        />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <Reveal delay={0.45}>
            <p className="text-ink-dark-dim max-w-[46ch] text-[15px] leading-relaxed">
              {hero.sub}
            </p>
          </Reveal>

          <Reveal delay={0.55}>
            <Button href={hero.cta.href} variant="solid" className="!bg-ink-dark !text-ink hover:!bg-black">
              {hero.cta.label}
            </Button>
          </Reveal>
        </div>
      </div>
    </Panel>
  );
}
