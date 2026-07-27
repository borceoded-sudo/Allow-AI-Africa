import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3210);
const baseURL = `http://127.0.0.1:${PORT}`;

/**
 * The suite runs against a production build, not the dev server: security
 * headers, the static robots/sitemap routes and the real 404 status only exist
 * there, and several tests assert on them.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "line" : "list",

  use: {
    baseURL,
    trace: "on-first-retry",
    // Chromium is preinstalled in this environment; PLAYWRIGHT_BROWSERS_PATH
    // points at it, so nothing is downloaded.
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        /*
         * Must come after the device spread: the Desktop Chrome preset carries
         * its own 1280x720 viewport, and project-level `use` overrides the
         * global one — so setting this at the top level is silently ignored.
         *
         * Height matters here. Panels are one viewport tall, so it decides
         * which sections stay pinned and where their controls land; at 720 the
         * Solutions carousel arrows fall below the fold.
         */
        viewport: { width: 1440, height: 900 },
      },
    },
  ],

  webServer: {
    command: `npx next build && npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
