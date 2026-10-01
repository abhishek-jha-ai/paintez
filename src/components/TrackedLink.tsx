"use client";

import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

export function TrackedLink({
  href,
  event,
  location,
  external,
  className,
  children,
}: {
  href: string;
  event: AnalyticsEvent;
  location: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackEvent(event, { location })}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
