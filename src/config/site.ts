/**
 * Central business configuration.
 *
 * Everything that identifies the business lives here so the demo can be
 * customised in one place. Leave a field as an empty string when the value
 * is not confirmed — the UI hides anything that is not configured.
 *
 * ▸ REPLACE: phone, email, instagram and any other blank values once the
 *   owner confirms them. Never fill these with guesses.
 */

function resolveSiteUrl(): string {
  // 1. Explicit override (custom domain), e.g. https://www.example.com
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  // 2. Vercel production domain — available at build + runtime on Vercel.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  // 3. Local development
  return "http://localhost:3000";
}

export const siteConfig = {
  businessName: "Paint EZ of Clearwater",
  shortName: "Paint EZ",
  tagline: "Professional Painting. Made Easy.",
  city: "Clearwater",
  state: "FL",
  stateLong: "Florida",
  country: "US",
  url: resolveSiteUrl(),

  // ▸ REPLACE with confirmed contact details (leave "" to hide).
  phone: "", // display format, e.g. "(727) 555-0100"
  email: "", // e.g. "hello@example.com"
  instagram: "", // full profile URL, e.g. "https://www.instagram.com/<handle>/"
  facebook: "",

  /** Shows the small "Website Concept" line in the footer. Set false at launch. */
  demoMode: true,
  demoLabel: "Website Concept for Paint EZ of Clearwater",

  serviceArea: "Clearwater, FL",
} as const;

export type SiteConfig = typeof siteConfig;

/** `tel:` href from the configured phone number, or null when not configured. */
export function phoneHref(): string | null {
  const digits = siteConfig.phone.replace(/\D/g, "");
  if (!digits) return null;
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
}

export function emailHref(): string | null {
  return siteConfig.email ? `mailto:${siteConfig.email}` : null;
}
