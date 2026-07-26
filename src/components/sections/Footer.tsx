"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { footerLinks, site } from "@/lib/content";
import { subscribe, type FormState } from "@/app/actions";
import { Panel } from "@/components/layout/Panel";
import { Reveal } from "@/components/motion/Reveal";
import { Logo } from "@/components/ui/atoms";

const INITIAL: FormState = { ok: false, message: "" };

function SubscribeButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Subscribe to the newsletter"
      className="bg-verdigris text-ink-dark absolute top-1/2 right-1.5 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 disabled:opacity-50"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
        <path
          d="M2.5 8h10M9 4.5 12.5 8 9 11.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/**
 * Closing panel. Book-ends the page with the oversized wordmark introduced in
 * the About section, mirroring the opening so the scroll reads as a loop.
 */
export function Footer({ index }: { index: number }) {
  const [state, formAction] = useActionState(subscribe, INITIAL);
  const year = new Date().getFullYear();

  return (
    <Panel index={index} tone="soft" full={false} className="!justify-end">
      <div className="mx-auto w-full max-w-[1180px] px-6 pt-16 pb-8 sm:px-10 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <Logo />
            <p className="font-display mt-6 max-w-[20ch] text-[clamp(21px,2.6vw,30px)] leading-[1.16] font-normal tracking-[-0.02em]">
              Applied AI, built in Africa, for the next billion people.
            </p>

            <Reveal delay={0.1}>
              <form action={formAction} className="mt-8 max-w-[400px]">
                <label
                  htmlFor="newsletter-email"
                  className="text-ink-faint block font-sans text-[10.5px] tracking-[0.18em] uppercase"
                >
                  Field notes, monthly
                </label>

                <div aria-hidden="true" className="absolute -left-[9999px]">
                  <input
                    name="company_website"
                    type="text"
                    aria-label="Leave this field empty"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="relative mt-3">
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    defaultValue={state.values?.email}
                    placeholder="Enter your email"
                    aria-describedby="newsletter-status"
                    className="text-ink placeholder:text-ink-faint focus:border-verdigris w-full rounded-full border border-white/15 bg-white/[0.03] py-3 pr-12 pl-5 font-sans text-[14px] transition-colors duration-300 focus:outline-none"
                  />
                  <SubscribeButton />
                </div>

                <p
                  id="newsletter-status"
                  role="status"
                  aria-live="polite"
                  className={[
                    "mt-2.5 min-h-[18px] text-[12px]",
                    state.ok ? "text-verdigris" : "text-red-300",
                  ].join(" ")}
                >
                  {state.message}
                </p>
              </form>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-2">
            <div>
              <p className="text-ink-faint font-sans text-[10.5px] tracking-[0.18em] uppercase">
                Quick links
              </p>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-ink-dim hover:text-ink text-[13.5px] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-ink-faint font-sans text-[10.5px] tracking-[0.18em] uppercase">
                Offices
              </p>
              <ul className="mt-4 space-y-2.5">
                {site.offices.map((office) => (
                  <li
                    key={office.city}
                    className="text-ink-dim text-[13.5px] leading-snug"
                  >
                    {office.city}, {office.country}
                  </li>
                ))}
              </ul>

              <p className="text-ink-faint mt-8 font-sans text-[10.5px] tracking-[0.18em] uppercase">
                Contact
              </p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-ink-dim hover:text-ink text-[13.5px] transition-colors"
                  >
                    {site.email}
                  </a>
                </li>
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-ink-dim hover:text-ink text-[13.5px] transition-colors"
                    >
                      {social.label}
                      <span className="text-ink-faint ml-1.5 text-[11.5px]">
                        {social.handle}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Book-end wordmark */}
        <p
          aria-hidden="true"
          className="font-display mt-16 w-full text-center text-[clamp(34px,11.6vw,158px)] leading-[0.85] font-semibold tracking-[-0.045em] whitespace-nowrap text-white/[0.055] select-none"
        >
          Allow AI Africa
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
          <p className="text-ink-faint font-sans text-[10.5px] tracking-[0.14em] uppercase">
            © {year} {site.name}. All rights reserved.
          </p>

          <a
            href="#top"
            className="text-ink-faint hover:text-ink group inline-flex items-center gap-2 font-sans text-[10.5px] tracking-[0.14em] uppercase transition-colors duration-300"
          >
            Back to the top
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              <path
                d="M8 13V3M4.5 6.5 8 3l3.5 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </Panel>
  );
}
