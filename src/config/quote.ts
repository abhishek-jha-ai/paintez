/**
 * Quote funnel configuration.
 *
 * Steps are rendered in order by <QuoteWizard />. Add, remove or reorder
 * steps here — each option `value` is what gets sent to the lead endpoint.
 * The final contact step is defined by `contactFields`.
 */
import type { AnalyticsEvent } from "@/lib/analytics";

export type QuoteChoiceStep = {
  id: "timeline" | "service" | "propertyType" | "projectSize";
  question: string;
  helper?: string;
  event: AnalyticsEvent;
  options: { value: string; label: string; hint?: string }[];
};

export const quoteSteps: QuoteChoiceStep[] = [
  {
    id: "timeline",
    question: "How soon do you want to have your house painted?",
    event: "timeline_selected",
    options: [
      { value: "asap", label: "ASAP" },
      { value: "1-2-months", label: "1–2 Months" },
      { value: "3-plus-months", label: "3+ Months" },
      { value: "just-quotes", label: "Just Getting Quotes" },
    ],
  },
  {
    id: "service",
    question: "What do you need painted?",
    event: "service_selected",
    options: [
      { value: "interior", label: "Interior" },
      { value: "exterior", label: "Exterior" },
      { value: "cabinets", label: "Cabinets" },
      { value: "multiple", label: "Multiple Areas" },
      { value: "not-sure", label: "Not Sure Yet" },
    ],
  },
  {
    id: "propertyType",
    question: "What type of property?",
    event: "property_type_selected",
    options: [
      { value: "single-family", label: "Single-family home" },
      { value: "condo-townhome", label: "Condo / Townhome" },
      { value: "rental", label: "Rental property" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "projectSize",
    question: "Approximate project size",
    helper: "A rough idea is perfect — we'll confirm the details with you.",
    event: "project_size_selected",
    options: [
      { value: "small-area", label: "One room / small area" },
      { value: "several-rooms", label: "Several rooms" },
      { value: "whole-interior", label: "Whole interior" },
      { value: "exterior", label: "Exterior" },
      { value: "cabinets", label: "Cabinets" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
];

export const contactStep = {
  question: "Where should we send your free quote?",
  helper: "Last step — just your contact details.",
  submitLabel: "Get My Free Quote",
};

export const TOTAL_QUOTE_STEPS = quoteSteps.length + 1;

/** Human-readable label for a stored option value (used in lead payloads). */
export function optionLabel(stepId: QuoteChoiceStep["id"], value: string | undefined): string | undefined {
  if (!value) return undefined;
  return quoteSteps.find((s) => s.id === stepId)?.options.find((o) => o.value === value)?.label ?? value;
}
