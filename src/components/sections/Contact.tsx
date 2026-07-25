"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { contact, site } from "@/lib/content";
import { submitContact, type FormState } from "@/app/actions";
import { GradientFlow } from "@/components/art/GradientFlow";
import { Panel, PanelInner } from "@/components/layout/Panel";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/atoms";
import { SocialIcons } from "@/components/ui/SocialIcons";

const INITIAL: FormState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="solid" disabled={pending}>
      {pending ? "Sending…" : "Submit"}
    </Button>
  );
}

export function Contact({ index }: { index: number }) {
  const [state, formAction] = useActionState(submitContact, INITIAL);

  return (
    <Panel id="contact" index={index} tone="dark">
      <PanelInner>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <LineReveal
              lines={contact.headline}
              className="font-display max-w-[18ch] text-[clamp(26px,3.6vw,44px)] leading-[1.1] font-normal tracking-[-0.025em]"
            />

            <Reveal delay={0.15}>
              <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
                <div>
                  <dt className="text-ink-faint font-sans text-[10.5px] tracking-[0.18em] uppercase">
                    Phone
                  </dt>
                  <dd className="mt-2 text-[13.5px]">
                    <a
                      href={`tel:${site.phone.replace(/\s/g, "")}`}
                      className="hover:text-verdigris transition-colors"
                    >
                      {site.phone}
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-ink-faint font-sans text-[10.5px] tracking-[0.18em] uppercase">
                    E-mail
                  </dt>
                  <dd className="mt-2 text-[13.5px]">
                    <a
                      href={`mailto:${site.email}`}
                      className="hover:text-verdigris transition-colors"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-ink-faint font-sans text-[10.5px] tracking-[0.18em] uppercase">
                    Offices
                  </dt>
                  <dd className="mt-2 text-[13.5px] leading-relaxed">
                    {site.offices.map((office) => (
                      <span key={office.city} className="block">
                        {office.city}, {office.country}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.25}>
              <form action={formAction} className="mt-9">
                <h2 className="font-display text-[21px] font-normal">
                  Contact us!
                </h2>

                {/* Honeypot — visually hidden, never focusable */}
                <div aria-hidden="true" className="absolute -left-[9999px]">
                  <label htmlFor="company_website">Company website</label>
                  <input
                    id="company_website"
                    name="company_website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2">
                  <Field
                    name="firstName"
                    label="Name"
                    required
                    autoComplete="given-name"
                    defaultValue={state.values?.firstName}
                    error={state.fieldErrors?.firstName}
                  />
                  <Field
                    name="lastName"
                    label="Surname"
                    autoComplete="family-name"
                    defaultValue={state.values?.lastName}
                    error={state.fieldErrors?.lastName}
                  />
                  <Field
                    name="email"
                    label="Email address"
                    type="email"
                    required
                    autoComplete="email"
                    defaultValue={state.values?.email}
                    error={state.fieldErrors?.email}
                  />
                  <Field
                    name="organisation"
                    label="Organisation"
                    autoComplete="organization"
                    defaultValue={state.values?.organisation}
                    error={state.fieldErrors?.organisation}
                  />
                  <Field
                    name="message"
                    label="Your message"
                    textarea
                    required
                    className="sm:col-span-2"
                    defaultValue={state.values?.message}
                    error={state.fieldErrors?.message}
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <p
                    role="status"
                    aria-live="polite"
                    className={[
                      "max-w-[42ch] text-[13px]",
                      state.message
                        ? state.ok
                          ? "text-verdigris"
                          : "text-red-300"
                        : "text-transparent",
                    ].join(" ")}
                  >
                    {state.message || "placeholder"}
                  </p>

                  <SubmitButton />
                </div>
              </form>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="flex">
            <div className="relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-[20px] p-7">
              <GradientFlow seed={13} className="absolute inset-0" />

              <p className="text-ink/85 relative max-w-[34ch] text-[13.5px] leading-relaxed">
                {contact.intro}
              </p>

              <div className="relative self-end rounded-[14px] border border-white/15 bg-black/35 px-4 py-3.5 backdrop-blur-md">
                <p className="text-ink mb-2.5 text-[12.5px]">
                  {contact.quickContact}
                </p>
                <SocialIcons tone="onDark" />
              </div>
            </div>
          </Reveal>
        </div>
      </PanelInner>
    </Panel>
  );
}
