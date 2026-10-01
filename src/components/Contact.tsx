"use client";

import { ArrowRight, CircleCheck, LoaderCircle, Mail, MapPin, Phone } from "lucide-react";
import { useRef, useState } from "react";
import { quoteSteps } from "@/config/quote";
import { emailHref, phoneHref, siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { submitLead } from "@/lib/leads/submit";
import { Field, Honeypot, useContactForm } from "./forms";
import { InstagramIcon } from "./Icon";
import { QuoteButton } from "./QuoteButton";
import { SectionHeading } from "./SectionHeading";

const serviceOptions = quoteSteps.find((s) => s.id === "service")?.options ?? [];

export function Contact() {
  const contact = useContactForm();
  const formRef = useRef<HTMLFormElement>(null);
  const [service, setService] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const tel = phoneHref();
  const mail = emailHref();

  const methods = [
    tel && { icon: Phone, label: "Call", value: siteConfig.phone, href: tel, event: "phone_clicked" as const },
    mail && { icon: Mail, label: "Email", value: siteConfig.email, href: mail, event: "email_clicked" as const },
    siteConfig.instagram && {
      icon: InstagramIcon,
      label: "Instagram",
      value: "Follow our latest projects",
      href: siteConfig.instagram,
      event: "instagram_clicked" as const,
    },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href: string; event: "phone_clicked" | "email_clicked" | "instagram_clicked" }[];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!contact.validateAll(formRef.current)) return;
    setStatus("submitting");
    const v = contact.values;
    const result = await submitLead({ source: "contact_form", ...v, service: service || undefined, message: v.message || undefined });
    if (result.ok) {
      trackEvent("quote_submitted", { source: "contact_form", service, demo: result.demo });
      setStatus("success");
      contact.reset();
    } else {
      trackEvent("quote_failed", { source: "contact_form" });
      if (result.errors) contact.setErrors(result.errors);
      setError(result.error);
      setStatus("idle");
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-16 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title="Ready for a"
            highlight="Fresh Look?"
            description="Send us a quick message and we'll get back to you about your free quote. Prefer a guided version? Our 5-step quote takes about a minute."
            align="left"
          />
          <ul className="mt-8 grid gap-3">
            {methods.map((mth) => (
              <li key={mth.label}>
                <a
                  href={mth.href}
                  onClick={() => trackEvent(mth.event, { location: "contact" })}
                  {...(mth.label === "Instagram" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card transition-shadow hover:shadow-lift"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <mth.icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted">{mth.label}</span>
                    <span className="block font-display text-lg font-semibold text-navy-950">{mth.value}</span>
                  </span>
                </a>
              </li>
            ))}
            <li className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <MapPin className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-muted">Service area</span>
                <span className="block font-display text-lg font-semibold text-navy-950">{siteConfig.serviceArea}</span>
              </span>
            </li>
          </ul>
          <QuoteButton source="contact_guided" className="btn btn-secondary mt-6">
            Start the 5-step quote
          </QuoteButton>
        </div>

        <div className="rounded-3xl border border-line bg-white p-5 shadow-lift sm:p-8">
          {status === "success" ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center text-center" role="status">
              <CircleCheck className="h-14 w-14 text-teal-600" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl font-bold text-navy-950">Message sent — thank you!</h3>
              <p className="mt-2 max-w-sm text-muted">We&apos;ll be in touch about your free quote soon.</p>
              <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm font-semibold text-teal-700 hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form ref={formRef} noValidate onSubmit={onSubmit} className="relative grid gap-4 sm:grid-cols-2" aria-label="Quick quote request">
              <h3 className="font-display text-xl font-bold text-navy-950 sm:col-span-2">Request a free quote</h3>
              <Field id="c-name" label="Name" autoComplete="name" className="sm:col-span-2" {...contact.field("name")} />
              <Field id="c-phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel-national" {...contact.field("phone")} />
              <Field id="c-email" label="Email" type="email" inputMode="email" autoComplete="email" {...contact.field("email")} />
              <Field id="c-zip" label="ZIP code" inputMode="numeric" autoComplete="postal-code" maxLength={5} {...contact.field("zip")} />
              <div>
                <label htmlFor="c-service" className="mb-1.5 block text-sm font-semibold text-navy-900">
                  What needs painting? <span className="font-normal text-muted">(optional)</span>
                </label>
                <select
                  id="c-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="block h-12 w-full rounded-xl border border-line bg-white px-3.5 text-base text-navy-950 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
                >
                  <option value="">Choose one</option>
                  {serviceOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <Field id="c-message" label="Message" optional multiline placeholder="Tell us about your project" className="sm:col-span-2" {...contact.field("message")} />
              <Honeypot value={contact.values.company} onChange={(v) => contact.set("company", v)} />
              {error ? (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2">
                  {error}
                </p>
              ) : null}
              <button type="submit" disabled={status === "submitting"} className="btn btn-primary min-h-14 w-full disabled:opacity-70 sm:col-span-2">
                {status === "submitting" ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  <>
                    Get My Free Quote <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
