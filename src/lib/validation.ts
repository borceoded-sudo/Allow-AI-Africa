import { z } from "zod";

/** Shared shapes for the contact form and newsletter signup. */

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your name").max(80),
  lastName: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address").max(160),
  organisation: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — 10 characters minimum")
    .max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const subscribeSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(160),
});

/**
 * Honeypot. It is deliberately outside the schemas above: a bot that fills it
 * must not trip ordinary validation, because a field-level error would tell it
 * exactly which input to leave alone next time. The actions check this value
 * before validating anything else and return a normal success.
 */
export const HONEYPOT_FIELD = "company_website";

export type SubscribeInput = z.infer<typeof subscribeSchema>;
