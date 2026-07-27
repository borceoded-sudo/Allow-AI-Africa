"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown by the root layout itself. It
 * replaces the whole document, so it must render its own <html>/<body> and
 * cannot rely on the app's fonts or Tailwind layer being present — hence the
 * inline styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] root layout error:", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0c1618",
          color: "#eef2f0",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "44ch" }}>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#5fd0b6",
            }}
          >
            Allow AI Africa
          </p>

          <h1
            style={{
              margin: "20px 0 0",
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: 500,
              lineHeight: 1.18,
              letterSpacing: "-0.02em",
            }}
          >
            The site failed to load
          </h1>

          <p
            style={{
              margin: "14px 0 0",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#93a5a4",
            }}
          >
            Something broke before the page could render. Reloading usually
            clears it.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "28px",
              border: 0,
              borderRadius: "999px",
              padding: "11px 22px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              backgroundColor: "#eef2f0",
              color: "#0b1112",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
