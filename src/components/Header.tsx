"use client";

import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks } from "@/config/content";
import { phoneHref, siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { Logo } from "./LogoMark";
import { QuoteButton } from "./QuoteButton";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const tel = phoneHref();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 transition-shadow ${
        scrolled || open ? "border-line shadow-[0_6px_20px_-12px_rgb(1_18_48/0.25)]" : "border-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <a href="#top" className="shrink-0 rounded-lg" aria-label={`${siteConfig.businessName} — home`} onClick={() => setOpen(false)}>
          <Logo className="origin-left scale-[0.92] sm:scale-100" />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 font-display text-[0.95rem] font-medium text-navy-900 transition-colors hover:bg-teal-50 hover:text-teal-700"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {tel ? (
            <a
              href={tel}
              onClick={() => trackEvent("phone_clicked", { location: "header" })}
              className="hidden items-center gap-2 rounded-full px-3 py-2 font-display font-semibold text-navy-950 hover:text-teal-700 xl:inline-flex"
            >
              <Phone className="h-4 w-4 text-teal-600" aria-hidden="true" />
              {siteConfig.phone}
            </a>
          ) : null}
          <QuoteButton source="header" className="btn btn-primary hidden min-h-11 px-5 text-[0.95rem] sm:inline-flex" arrow={false} />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-navy-950 hover:bg-teal-50 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="border-t border-line bg-white lg:hidden">
        <nav aria-label="Mobile" className="container-page py-3">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-3 font-display text-lg font-medium text-navy-950 hover:bg-teal-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid gap-2 pb-2" onClick={() => setOpen(false)}>
            <QuoteButton source="mobile_menu" className="btn btn-primary w-full" />
            {tel ? (
              <a href={tel} className="btn btn-secondary w-full" onClick={() => trackEvent("phone_clicked", { location: "mobile_menu" })}>
                <Phone className="h-4 w-4" aria-hidden="true" /> Call {siteConfig.phone}
              </a>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
