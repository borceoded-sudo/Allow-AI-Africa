"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { megaMenu, nav } from "@/lib/content";
import { Button, Logo } from "@/components/ui/atoms";

/**
 * Floating top bar with a mega-menu drawer. The bar starts transparent over
 * the hero and picks up a frosted background once the page scrolls, matching
 * the reference site's in-panel nav.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape, and lock body scroll while the drawer is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-100">
      <div
        className={[
          "transition-colors duration-500",
          scrolled || open
            ? "bg-page/72 border-b border-white/8 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-[1180px] items-center justify-between px-6 sm:px-10 lg:px-14">
          <Logo />

          {/* Desktop inline nav */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 rounded-full border border-white/12 bg-white/4 px-2 py-1.5 lg:flex"
          >
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-ink-dim hover:text-ink rounded-full px-3 py-1.5 text-[13px] transition-colors duration-300 hover:bg-white/8"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mega-menu"
              className="text-ink-dim hover:text-ink inline-flex items-center gap-2 rounded-full border border-white/12 px-3.5 py-2 text-[13px] transition-colors duration-300 hover:border-white/30"
            >
              <span className="text-verdigris">/</span>
              {open ? "Close" : "Menu"}
            </button>

            {/* Wrapped rather than given `hidden` directly: the Button base
                already sets a display utility, and which one wins depends on
                stylesheet order, not class order. */}
            <span className="hidden sm:block">
              <Button href="#contact" variant="outline">
                Contact Us
              </Button>
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mega-menu"
            key="mega"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="bg-page/94 overflow-hidden border-b border-white/8 backdrop-blur-2xl"
          >
            <div className="mx-auto w-full max-w-[1180px] px-6 py-10 sm:px-10 lg:px-14">
              <p className="text-ink-faint mb-8 text-[11px] tracking-[0.22em] uppercase">
                <span className="text-verdigris">/</span> Menu
              </p>

              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {megaMenu.map((group, gi) => (
                  <div key={group.group}>
                    <p className="text-ink-faint mb-4 text-[11px] tracking-[0.2em] uppercase">
                      {group.group}
                    </p>
                    <ul className="space-y-1">
                      {group.items.map((item, ii) => (
                        <motion.li
                          key={item.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.08 + gi * 0.05 + ii * 0.04,
                          }}
                        >
                          <a
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="group flex items-baseline justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors duration-300 hover:bg-white/5"
                          >
                            <span className="font-display group-hover:text-ink text-[17px] text-ink/85 transition-colors">
                              {item.label}
                            </span>
                            <span className="text-ink-faint text-[11px] tracking-wide">
                              {item.note}
                            </span>
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/8 pt-6 lg:hidden">
                {nav.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-ink-dim hover:text-ink text-sm transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
