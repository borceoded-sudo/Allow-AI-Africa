"use client";

import { useEffect } from "react";
import { Button, Logo } from "@/components/ui/atoms";

/**
 * Route-level error boundary. Catches render and data errors below the root
 * layout and offers a retry, so a transient failure never leaves a blank page.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side details are redacted in production; the digest is the only
    // handle that ties this render back to the server log entry.
    console.error("[app] unhandled error:", error.digest ?? error.message);
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col p-3 sm:p-4">
      <div className="bg-panel flex flex-1 flex-col items-center justify-center rounded-[var(--radius-panel)] px-6 text-center md:rounded-[var(--radius-panel-lg)]">
        <Logo />

        <h1 className="font-display mt-14 max-w-[20ch] text-[clamp(24px,3.4vw,38px)] leading-[1.14] font-normal tracking-[-0.02em]">
          Something went wrong on our side
        </h1>

        <p className="text-ink-dim mt-4 max-w-[44ch] text-[14px] leading-relaxed">
          This one is on us, not you. Try again — if it keeps happening, email
          us and we will pick it up.
        </p>

        {error.digest ? (
          <p className="text-ink-faint mt-6 font-sans text-[11px] tracking-[0.14em] uppercase">
            Reference {error.digest}
          </p>
        ) : null}

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-ink text-ink-dark inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 font-sans text-sm font-medium transition-colors duration-300 hover:bg-white"
          >
            Try again
          </button>

          <Button href="/" variant="outline">
            Back to the site
          </Button>
        </div>
      </div>
    </main>
  );
}
