/**
 * Single analytics entry point. Components call `trackEvent()` only — never a
 * provider SDK directly. Wire providers up in `dispatch()` below.
 *
 * Out of the box, events are pushed to `window.dataLayer` (Google Tag Manager)
 * and forwarded to `gtag` / Meta Pixel `fbq` if those scripts are present.
 */

export type AnalyticsEvent =
  | "quote_started"
  | "timeline_selected"
  | "service_selected"
  | "property_type_selected"
  | "project_size_selected"
  | "quote_submitted"
  | "quote_failed"
  | "before_after_used"
  | "gallery_viewed"
  | "phone_clicked"
  | "email_clicked"
  | "instagram_clicked"
  | "cta_clicked";

type Params = Record<string, string | number | boolean | undefined>;

type AnalyticsWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

// Map our events to Meta standard events where one exists.
const META_STANDARD_EVENTS: Partial<Record<AnalyticsEvent, string>> = {
  quote_submitted: "Lead",
  phone_clicked: "Contact",
  email_clicked: "Contact",
};

function dispatch(event: AnalyticsEvent, params: Params) {
  const w = window as AnalyticsWindow;
  w.dataLayer?.push({ event, ...params });
  w.gtag?.("event", event, params);
  if (w.fbq) {
    const standard = META_STANDARD_EVENTS[event];
    if (standard) w.fbq("track", standard, params);
    else w.fbq("trackCustom", event, params);
  }
}

export function trackEvent(event: AnalyticsEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  try {
    dispatch(event, params);
  } catch {
    // Analytics must never break the page.
  }
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, params);
  }
}
