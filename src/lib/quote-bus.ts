/**
 * Tiny event bus so any CTA can jump to the quote wizard and, optionally,
 * pre-select an answer (e.g. a service card pre-selects "Cabinets").
 */
export const QUOTE_EVENT = "paintez:quote";

export type QuotePrefill = { service?: string; source?: string };

export function openQuote(prefill: QuotePrefill = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<QuotePrefill>(QUOTE_EVENT, { detail: prefill }));
  const target = document.getElementById("quote");
  if (target) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#quote");
  }
}
