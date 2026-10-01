# Paint EZ of Clearwater — Website Concept

Mobile-first marketing site built to turn Instagram/Facebook ad traffic into quote requests.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion (quote steps + lightbox only) · next/image (AVIF/WebP)

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production build
```

## Where to edit things

| What | File |
| --- | --- |
| Business name, phone, email, Instagram, demo flag, site URL | `src/config/site.ts` |
| Page copy (hero, services, trust, about, process, nav) | `src/config/content.ts` |
| Before/after pairs + gallery images | `src/config/projects.ts` |
| Quote funnel steps & options | `src/config/quote.ts` |
| SEO / Open Graph copy | `src/config/seo.ts` → rendered in `src/app/layout.tsx` |
| Structured data (HousePainter JSON-LD) | `src/components/StructuredData.tsx` |
| Analytics events (single entry point) | `src/lib/analytics.ts` |
| Lead delivery (webhook / CRM adapters) | `src/lib/leads/deliver.ts`, API: `src/app/api/quote/route.ts` |

Blank contact fields are hidden automatically — the **Call** button, phone/email links and the
Instagram link appear as soon as they are filled in `site.ts`. Set `demoMode: false` to remove the
"Website Concept" line in the footer.

## Leads

Both the 5-step wizard and the contact form POST to `/api/quote`, which validates the payload and
calls `deliverLead()`. With no destination configured (demo mode) leads are logged and the visitor
sees the success screen.

Set `QUOTE_WEBHOOK_URL` (see `.env.example`) to forward each lead as JSON to Zapier, Make,
GoHighLevel, HubSpot workflows, n8n, etc. — from there route to email, SMS, CRM or calendar booking.
Add direct adapters (HubSpot Forms API, Twilio, Resend…) to the `adapters` array in `deliver.ts`.

## Analytics

Components only call `trackEvent(name, params)`. Events are pushed to `window.dataLayer` (GTM) and
forwarded to `gtag` / Meta Pixel `fbq` if present. Add the provider snippet once in `layout.tsx`.

## Social previews

- OG image: `public/og-paint-ez-clearwater.jpg` (1200×630). Regenerate with `node scripts/generate-assets.mjs`
  (also rebuilds favicons in `src/app/`).
- Absolute URLs come from `NEXT_PUBLIC_SITE_URL`, falling back to Vercel's production domain
  (`VERCEL_PROJECT_PRODUCTION_URL`). Set `NEXT_PUBLIC_SITE_URL` when a custom domain is added.

## Imagery

`public/images/` holds optimized versions of the supplied artwork. The cabinet "after" image is a
recolor of the supplied kitchen photo (`scripts/kitchen-after.py`). Replace before/after and gallery
images with real project photos as they become available.
