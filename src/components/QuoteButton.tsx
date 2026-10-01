"use client";

import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { openQuote } from "@/lib/quote-bus";

/** Any "Get a Free Quote" CTA. Renders a real #quote link so it works before hydration. */
export function QuoteButton({
  children = "Get a Free Quote",
  className = "btn btn-primary",
  service,
  source,
  arrow = true,
}: {
  children?: React.ReactNode;
  className?: string;
  service?: string;
  source: string;
  arrow?: boolean;
}) {
  return (
    <a
      href="#quote"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        trackEvent("cta_clicked", { source, service });
        openQuote({ service, source });
      }}
    >
      {children}
      {arrow ? <ArrowRight className="h-[1.1em] w-[1.1em]" aria-hidden="true" /> : null}
    </a>
  );
}
