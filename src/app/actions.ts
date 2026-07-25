"use server";

import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  contactSchema,
  subscribeSchema,
  HONEYPOT_FIELD,
} from "@/lib/validation";

export type FormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  /**
   * Echo of what was submitted. React resets an uncontrolled form once its
   * action resolves, so without this a validation error would wipe everything
   * the visitor typed.
   */
  values?: Record<string, string>;
};

const GENERIC_ERROR =
  "Something went wrong on our side. Please try again, or email us directly.";

const NOT_CONFIGURED =
  "The contact backend is not configured yet. Add your Supabase credentials to .env.local — see README.";

function firstErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Contact form → public.contact_submissions */
export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    organisation: String(formData.get("organisation") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot tripped — accept silently so bots get no signal about which
  // field gave them away. Checked before validation for the same reason.
  if (String(formData.get(HONEYPOT_FIELD) ?? "")) {
    return { ok: true, message: "Thanks — we'll be in touch shortly." };
  }

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: firstErrors(parsed.error.issues),
      values: raw,
    };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, message: NOT_CONFIGURED, values: raw };

  const userAgent = (await headers()).get("user-agent")?.slice(0, 500) ?? null;

  const { error } = await supabase.from("contact_submissions").insert({
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName || null,
    email: parsed.data.email.toLowerCase(),
    organisation: parsed.data.organisation || null,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
    source: "website",
    user_agent: userAgent,
  });

  if (error) {
    console.error("[contact] insert failed:", error.message);
    return { ok: false, message: GENERIC_ERROR, values: raw };
  }

  return {
    ok: true,
    message: "Thanks — your message is with us. We reply within two days.",
  };
}

/** Footer newsletter → public.newsletter_subscribers */
export async function subscribe(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = { email: String(formData.get("email") ?? "") };

  if (String(formData.get(HONEYPOT_FIELD) ?? "")) {
    return { ok: true, message: "You're on the list." };
  }

  const parsed = subscribeSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: firstErrors(parsed.error.issues),
      values: raw,
    };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, message: NOT_CONFIGURED, values: raw };

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: parsed.data.email.toLowerCase(), source: "footer" });

  // 23505 = unique violation. Already subscribed is a success from the
  // visitor's point of view, and confirming it leaks nothing they didn't type.
  if (error && error.code !== "23505") {
    console.error("[subscribe] insert failed:", error.message);
    return { ok: false, message: GENERIC_ERROR, values: raw };
  }

  return { ok: true, message: "You're on the list." };
}
