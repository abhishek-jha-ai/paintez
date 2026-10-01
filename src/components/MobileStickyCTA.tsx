"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { phoneHref } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { QuoteButton } from "./QuoteButton";

/** Compact bottom bar on mobile. Hides while a lead form is on screen so it never covers inputs. */
export function MobileStickyCTA() {
  const tel = phoneHref();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = ["quote", "contact"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setHidden(visible.size > 0);
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-3 pt-2.5 backdrop-blur transition-transform duration-300 pb-[max(0.625rem,env(safe-area-inset-bottom))] md:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
      aria-hidden={hidden}
      inert={hidden}
    >
      <div className="flex gap-2.5">
        {tel ? (
          <a
            href={tel}
            onClick={() => trackEvent("phone_clicked", { location: "sticky_bar" })}
            className="btn btn-secondary min-h-12 flex-1 px-4"
          >
            <Phone className="h-4 w-4 text-teal-600" aria-hidden="true" /> Call
          </a>
        ) : null}
        <QuoteButton source="sticky_bar" className={`btn btn-primary min-h-12 px-4 ${tel ? "flex-[1.6]" : "flex-1"}`}>
          Get a Free Quote
        </QuoteButton>
      </div>
    </div>
  );
}
