import { z } from "zod";
import { site } from "../config/site.ts";

const businessTypeIds = site.businessTypes.map((b) => b.id) as [string, ...string[]];

/** Indian mobile: optional +91 / 0, then 10 digits starting 6-9. Spaces and dashes allowed. */
export const indianMobile = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => /^(?:\+91|91|0)?[6-9]\d{9}$/.test(v), {
    message: "Enter a valid 10-digit Indian mobile number",
  })
  .transform((v) => `+91${v.slice(-10)}`);

const text = (label: string, max = 80) =>
  z
    .string()
    .trim()
    .min(2, `Enter your ${label}`)
    .max(max, `${label[0].toUpperCase()}${label.slice(1)} is too long`);

export const demoRequestSchema = z.object({
  name: text("name"),
  phone: indianMobile,
  restaurant: text("restaurant name", 120),
  city: text("city", 60),
  businessType: z.enum(businessTypeIds, { message: "Choose your business type" }),
  // Honeypot: real people never see or fill this field.
  website: z.string().max(0).optional().or(z.literal("")),
});
export type DemoRequestInput = z.input<typeof demoRequestSchema>;

const emailOrPhone = z
  .string()
  .trim()
  .min(1, "Enter an email or mobile number")
  .refine(
    (v) =>
      z.email().safeParse(v).success ||
      /^(?:\+91|91|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")),
    { message: "Enter a valid email or 10-digit mobile number" },
  );

export const integrationRequestSchema = z.object({
  name: text("name"),
  contact: emailOrPhone,
  category: z.enum(
    site.integrations.map((i) => i.title) as [string, ...string[]],
    { message: "Choose a category" },
  ),
  details: z.string().trim().max(500, "Keep it under 500 characters").optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
});
export type IntegrationRequestInput = z.input<typeof integrationRequestSchema>;

/** Field → first error message, for forms and API 400 responses. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
