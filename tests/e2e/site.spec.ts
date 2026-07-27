import { test, expect, type Page } from "@playwright/test";

/**
 * Scroll a panel to the position where it is the topmost layer.
 *
 * Two traps here, both learned the hard way:
 *  - `scroll-behavior: smooth` means scrollTo animates; assertions can fire
 *    mid-flight, so force an instant scroll.
 *  - Chrome's `offsetTop` reflects the sticky shift, so a panel already stuck
 *    at the top reports the wrong position. Reset to 0 before measuring.
 */
async function scrollToPanel(page: Page, id: string) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(150);
  await page.evaluate((panelId) => {
    const el = document.getElementById(panelId)!;
    window.scrollTo({ top: el.offsetTop, behavior: "instant" });
  }, id);
  await page.waitForTimeout(700);
}

/**
 * Click at real coordinates. Playwright's auto scroll-into-view would move the
 * page off the panel's pinned position, where the next panel covers the target.
 */
async function clickAt(page: Page, selector: string) {
  const box = await page.evaluate((sel) => {
    const r = document.querySelector(sel)!.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, selector);
  await page.mouse.click(box.x, box.y);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1200);
});

test.describe("page shell", () => {
  test("renders the hero and every panel", async ({ page }) => {
    await expect(page).toHaveTitle(/Allow AI Africa/);
    await expect(page.locator("h1")).toContainText("Applied AI, built in Africa");
    await expect(page.locator(".stack-item")).toHaveCount(12);
  });

  test("has no horizontal overflow at desktop or mobile", async ({ page }) => {
    for (const size of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(size);
      await page.waitForTimeout(600);
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows, `overflow at ${size.width}px`).toBe(false);
    }
  });

  /**
   * A panel taller than the viewport must not stay pinned — its lower half
   * would sit off-screen permanently and be unreachable.
   */
  test("never pins a panel taller than the viewport", async ({ page }) => {
    for (const size of [
      { width: 1440, height: 900 },
      { width: 1024, height: 800 },
    ]) {
      await page.setViewportSize(size);
      await page.waitForTimeout(800);
      const stranded = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>(".stack-item")].filter(
          (el) =>
            getComputedStyle(el).position === "sticky" &&
            el.offsetHeight > window.innerHeight + 1,
        ).length,
      );
      expect(stranded, `stranded panels at ${size.height}px`).toBe(0);
    }
  });
});

test.describe("navigation", () => {
  test("scrolls down to a section", async ({ page }) => {
    await page.click('nav a[href="#faq"]');
    await page.waitForTimeout(2200);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
  });

  /**
   * Regression: every sticky panel shares <main> as its containing block, so a
   * panel already scrolled past reports top:0 forever. With the id on the panel
   * itself, anchors concluded it was already in view and refused to move —
   * upward navigation silently did nothing. The id lives on a zero-height
   * marker in normal flow to keep the true position.
   */
  test("scrolls back up to an earlier section", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 9000, behavior: "instant" }));
    await page.waitForTimeout(500);
    const before = await page.evaluate(() => window.scrollY);

    await page.click('nav a[href="#solutions"]');
    await page.waitForTimeout(2200);

    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeLessThan(before);
  });

  test("back-to-top returns to the hero", async ({ page }) => {
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
    );
    await page.waitForTimeout(600);
    await page.click('a:has-text("Back to the top")');
    await page.waitForTimeout(2500);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });

  test("mega-menu opens and closes on Escape", async ({ page }) => {
    await page.click('button:has-text("Menu")');
    await expect(page.locator("#mega-menu")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mega-menu")).toHaveCount(0);
  });
});

test.describe("interactive sections", () => {
  test("technology tabs swap the artwork and copy", async ({ page }) => {
    await scrollToPanel(page, "technology");
    const first = await page.textContent("#tech-panel h3");

    await page.click('[role=tab]:has-text("Adaptive Machine Learning")');
    await page.waitForTimeout(700);

    await expect(page.locator("#tech-panel h3")).toHaveText(
      "Adaptive Machine Learning",
    );
    expect(await page.textContent("#tech-panel h3")).not.toBe(first);
    await expect(
      page.locator('[role=tab]:has-text("Adaptive Machine Learning")'),
    ).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("[data-panel=technology]")).toContainText("3/4");
  });

  test("FAQ categories filter and rows expand", async ({ page }) => {
    await scrollToPanel(page, "faq");
    const rows = page.locator("[data-panel=faq] h3 button");

    const firstQuestion = await rows.first().textContent();
    await page.click('[data-panel=faq] [role=tab]:has-text("Data Commons")');
    await page.waitForTimeout(600);
    expect(await rows.first().textContent()).not.toBe(firstQuestion);

    await expect(rows.first()).toHaveAttribute("aria-expanded", "true");
    await clickAt(page, "[data-panel=faq] h3:nth-of-type(1) button");
    await expect(rows.first()).toHaveAttribute("aria-expanded", "false");
  });

  test("testimonials swap both ways", async ({ page }) => {
    await scrollToPanel(page, "voices");
    const quote = page.locator("[data-panel=voices] blockquote");
    const first = await quote.textContent();

    await clickAt(
      page,
      '[data-panel=voices] button[aria-label="Next testimonial"]',
    );
    await page.waitForTimeout(800);
    expect(await quote.textContent()).not.toBe(first);

    await clickAt(
      page,
      '[data-panel=voices] button[aria-label="Previous testimonial"]',
    );
    await page.waitForTimeout(800);
    expect(await quote.textContent()).toBe(first);
  });

  for (const { panel, label } of [
    { panel: "solutions", label: "Solutions" },
    { panel: "case-studies", label: "Case studies" },
  ]) {
    test(`${label} carousel pages forward`, async ({ page }) => {
      await scrollToPanel(page, panel);
      await expect(
        page.locator(`[data-panel=${panel}] button[aria-label="Next"]`),
      ).toBeEnabled();

      await expect(
        page.locator(`[data-panel=${panel}] button[aria-label="Previous"]`),
      ).toBeDisabled();

      const track = `[aria-label="${label}"]`;
      const before = await page.evaluate(
        (sel) => document.querySelector(sel)!.scrollLeft,
        track,
      );

      await clickAt(page, `[data-panel=${panel}] button[aria-label="Next"]`);

      // The track scrolls smoothly, so poll rather than assume a duration.
      await expect
        .poll(
          () =>
            page.evaluate(
              (sel) => document.querySelector(sel)!.scrollLeft,
              track,
            ),
          { timeout: 5000 },
        )
        .toBeGreaterThan(before);
    });
  }
});

test.describe("contact form", () => {
  test("rejects a short message and keeps what was typed", async ({ page }) => {
    await page.goto("/#contact");
    await page.waitForTimeout(1200);

    await page.fill("#firstName", "Ada");
    await page.fill("#lastName", "Nwosu");
    await page.fill("#email", "ada@example.com");
    await page.fill("#organisation", "Sahara Bank");
    await page.fill("#message", "short");
    await clickAt(page, "form button[type=submit]");
    await page.waitForTimeout(1800);

    await expect(page.locator("#message-error")).toContainText("10 characters");

    // React resets an uncontrolled form once its action resolves, so the
    // values have to be echoed back or the visitor loses everything.
    await expect(page.locator("#firstName")).toHaveValue("Ada");
    await expect(page.locator("#lastName")).toHaveValue("Nwosu");
    await expect(page.locator("#email")).toHaveValue("ada@example.com");
    await expect(page.locator("#organisation")).toHaveValue("Sahara Bank");
  });

  /**
   * A bot that trips the honeypot gets an ordinary success. A field-level
   * error would tell it exactly which input to leave alone next time.
   */
  test("honeypot submissions get a silent success", async ({ page }) => {
    await page.goto("/#contact");
    await page.waitForTimeout(1200);

    await page.evaluate(() => {
      (
        document.getElementById("company_website") as HTMLInputElement
      ).value = "http://spam.example";
    });
    await page.fill("#firstName", "Bot");
    await page.fill("#email", "bot@example.com");
    await page.fill("#message", "buy cheap things right now from our shop");
    await clickAt(page, "form button[type=submit]");
    await page.waitForTimeout(1800);

    await expect(
      page.locator('[data-panel=contact] form [role=status]'),
    ).toContainText("be in touch");
  });
});

test.describe("error and metadata routes", () => {
  test("serves a branded 404", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("isn’t here");

    await page.click('a:has-text("Back to the site")');
    await page.waitForTimeout(1500);
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("exposes robots.txt and sitemap.xml", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("User-Agent: *");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("<urlset");
  });

  test("sets security headers and hides the framework version", async ({
    request,
  }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});

test.describe("accessibility basics", () => {
  test("has one h1, labelled controls and unique ids", async ({ page }) => {
    const audit = await page.evaluate(() => {
      const name = (el: Element) =>
        (el.getAttribute("aria-label") || el.textContent || "").trim();
      const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
      return {
        h1: document.querySelectorAll("h1").length,
        namelessLinks: [...document.querySelectorAll("a")].filter(
          (a) => !name(a),
        ).length,
        namelessButtons: [...document.querySelectorAll("button")].filter(
          (b) => !name(b),
        ).length,
        unlabelledFields: [
          ...document.querySelectorAll("input,textarea"),
        ].filter((f) => {
          const el = f as HTMLInputElement;
          if (el.type === "hidden") return false;
          return (
            !document.querySelector(`label[for="${el.id}"]`) &&
            !el.getAttribute("aria-label")
          );
        }).length,
        duplicateIds: ids.filter((v, i) => ids.indexOf(v) !== i),
        tabsOutsideTablist: [...document.querySelectorAll("[role=tab]")].filter(
          (t) => !t.closest("[role=tablist]"),
        ).length,
      };
    });

    expect(audit.h1).toBe(1);
    expect(audit.namelessLinks).toBe(0);
    expect(audit.namelessButtons).toBe(0);
    expect(audit.unlabelledFields).toBe(0);
    expect(audit.duplicateIds).toEqual([]);
    expect(audit.tabsOutsideTablist).toBe(0);
  });
});
