import type { Metadata } from "next";
import { Button, Logo } from "@/components/ui/atoms";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col p-3 sm:p-4">
      <div className="bg-panel flex flex-1 flex-col items-center justify-center rounded-[var(--radius-panel)] px-6 text-center md:rounded-[var(--radius-panel-lg)]">
        <Logo />

        <p className="font-display text-verdigris mt-14 text-[clamp(56px,12vw,120px)] leading-none font-medium tracking-[-0.04em]">
          404
        </p>

        <h1 className="font-display mt-6 max-w-[18ch] text-[clamp(22px,3vw,34px)] leading-[1.14] font-normal tracking-[-0.02em]">
          That page isn&rsquo;t here
        </h1>

        <p className="text-ink-dim mt-4 max-w-[42ch] text-[14px] leading-relaxed">
          The link may be out of date, or the page may have moved. Everything we
          publish lives on the main page.
        </p>

        <div className="mt-9">
          <Button href="/" variant="solid">
            Back to the site
          </Button>
        </div>
      </div>
    </main>
  );
}
