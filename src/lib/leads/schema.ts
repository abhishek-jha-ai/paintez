/**
 * Lead shape + validation shared by the browser and the /api/quote route.
 * Kept dependency-free on purpose.
 */

export type LeadSource = "quote_wizard" | "contact_form";

export type LeadInput = {
  source: LeadSource;
  name: string;
  phone: string;
  email: string;
  zip: string;
  message?: string;
  timeline?: string;
  service?: string;
  propertyType?: string;
  projectSize?: string;
  /** Honeypot — must stay empty. */
  company?: string;
};

export type ContactFieldErrors = Partial<Record<"name" | "phone" | "email" | "zip" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

export function formatPhoneInput(value: string): string {
  const d = normalizePhone(value).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function validateContact(input: Pick<LeadInput, "name" | "phone" | "email" | "zip" | "message">): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  if (input.name.trim().length < 2) errors.name = "Please enter your name.";
  if (normalizePhone(input.phone).length !== 10) errors.phone = "Please enter a 10-digit phone number.";
  if (!EMAIL_RE.test(input.email.trim())) errors.email = "Please enter a valid email address.";
  if (!/^\d{5}$/.test(input.zip.trim())) errors.zip = "Please enter a 5-digit ZIP code.";
  if ((input.message ?? "").length > 1000) errors.message = "Please keep your message under 1,000 characters.";
  return errors;
}

export type Lead = Omit<LeadInput, "company"> & {
  id: string;
  submittedAt: string;
  business: string;
  /** Human-readable answers, handy for email / SMS templates. */
  summary: Record<string, string>;
};
