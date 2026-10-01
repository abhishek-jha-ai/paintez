"use client";

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleCheck, LoaderCircle, Phone } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { contactStep, optionLabel, quoteSteps, TOTAL_QUOTE_STEPS, type QuoteChoiceStep } from "@/config/quote";
import { phoneHref, siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { submitLead } from "@/lib/leads/submit";
import { QUOTE_EVENT, type QuotePrefill } from "@/lib/quote-bus";
import { Field, Honeypot, useContactForm } from "./forms";

type Answers = Partial<Record<QuoteChoiceStep["id"], string>>;
type Status = "idle" | "submitting" | "success";

export function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const started = useRef(false);
  const advanceTimer = useRef<number | undefined>(undefined);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const hasNavigated = useRef(false);
  const reduceMotion = useReducedMotion();
  const contact = useContactForm();

  const isContactStep = step === quoteSteps.length;
  const progress = Math.round(((step + 1) / TOTAL_QUOTE_STEPS) * 100);

  // Pre-select answers when a CTA elsewhere opens the quote (e.g. "Get a cabinet quote").
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const { service } = (e as CustomEvent<QuotePrefill>).detail ?? {};
      if (service) setAnswers((a) => ({ ...a, service }));
    };
    window.addEventListener(QUOTE_EVENT, onPrefill);
    return () => window.removeEventListener(QUOTE_EVENT, onPrefill);
  }, []);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  // Move focus to the new question for keyboard / screen-reader users.
  useEffect(() => {
    if (hasNavigated.current) headingRef.current?.focus({ preventScroll: true });
  }, [step, status]);

  const goTo = useCallback((next: number) => {
    hasNavigated.current = true;
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }, [step]);

  const choose = (s: QuoteChoiceStep, value: string) => {
    if (!started.current) {
      started.current = true;
      trackEvent("quote_started", { first_step: s.id });
    }
    trackEvent(s.event, { value });
    setAnswers((a) => ({ ...a, [s.id]: value }));
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => goTo(step + 1), reduceMotion ? 0 : 220);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    if (!contact.validateAll(formRef.current)) return;
    setStatus("submitting");
    const v = contact.values;
    const result = await submitLead({ source: "quote_wizard", ...answers, ...v, message: v.message || undefined });
    if (result.ok) {
      trackEvent("quote_submitted", { source: "quote_wizard", ...answers, demo: result.demo });
      setFirstName(v.name.trim().split(/\s+/)[0] ?? "");
      hasNavigated.current = true;
      setStatus("success");
      contact.reset();
    } else {
      trackEvent("quote_failed", { source: "quote_wizard" });
      if (result.errors) contact.setErrors(result.errors);
      setSubmitError(result.error);
      setStatus("idle");
    }
  };

  const restart = () => {
    setAnswers({});
    setStatus("idle");
    started.current = false;
    goTo(0);
    setDirection(-1);
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: reduceMotion ? 0 : dir * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: reduceMotion ? 0 : dir * -28 }),
  };

  const tel = phoneHref();
  const current = quoteSteps[step];

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="relative overflow-hidden rounded-3xl bg-white text-navy-950 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)]">
        {status === "success" ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center sm:px-10" aria-live="polite">
            <m.span
              initial={{ scale: reduceMotion ? 1 : 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-600"
            >
              <CircleCheck className="h-11 w-11" aria-hidden="true" />
            </m.span>
            <h3 ref={headingRef} tabIndex={-1} className="mt-6 font-display text-2xl font-bold outline-none sm:text-3xl">
              Thanks{firstName ? `, ${firstName}` : ""}! Your quote request is in.
            </h3>
            <p className="mt-3 max-w-md leading-relaxed text-muted">
              {siteConfig.businessName} will reach out using the contact details you provided to talk through your project.
            </p>
            {tel ? (
              <a href={tel} onClick={() => trackEvent("phone_clicked", { location: "quote_success" })} className="btn btn-secondary mt-6">
                <Phone className="h-4 w-4" aria-hidden="true" /> Prefer to talk? Call {siteConfig.phone}
              </a>
            ) : null}
            <button type="button" onClick={restart} className="mt-6 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline">
              Start another request
            </button>
          </div>
        ) : (
          <>
            {/* progress */}
            <div className="border-b border-line px-5 pb-4 pt-5 sm:px-8 sm:pt-6">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-muted">
                  Step {step + 1} of {TOTAL_QUOTE_STEPS}
                </span>
                <span className="text-teal-700">{progress}% Complete</span>
              </div>
              <div
                className="mt-2.5 h-2 overflow-hidden rounded-full bg-teal-50"
                role="progressbar"
                aria-label="Quote progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div className="h-full rounded-full bg-teal-500 transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="relative min-h-[360px] px-5 pb-6 pt-6 sm:min-h-[340px] sm:px-8 sm:pb-8">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <m.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {!isContactStep && current ? (
                    <fieldset>
                      <legend className="contents">
                        <h3 ref={headingRef} tabIndex={-1} className="font-display text-[1.4rem] font-bold leading-snug outline-none sm:text-2xl">
                          {current.question}
                        </h3>
                      </legend>
                      {current.helper ? <p className="mt-1.5 text-[0.95rem] text-muted">{current.helper}</p> : null}
                      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                        {current.options.map((option) => {
                          const selected = answers[current.id] === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => choose(current, option.value)}
                              className={`group flex min-h-14 items-center justify-between gap-3 rounded-xl border-2 px-4 text-left font-display text-[1.02rem] font-semibold transition-all ${
                                selected
                                  ? "border-teal-500 bg-teal-50 text-navy-950"
                                  : "border-line bg-white text-navy-900 hover:border-teal-400 hover:bg-teal-50/50"
                              }`}
                            >
                              {option.label}
                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                  selected ? "border-teal-500 bg-teal-500 text-white" : "border-slate-300 text-transparent group-hover:border-teal-400"
                                }`}
                              >
                                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ) : (
                    <form ref={formRef} noValidate onSubmit={onSubmit} className="relative">
                      <h3 ref={headingRef} tabIndex={-1} className="font-display text-[1.4rem] font-bold leading-snug outline-none sm:text-2xl">
                        {contactStep.question}
                      </h3>
                      <p className="mt-1.5 text-[0.95rem] text-muted">{contactStep.helper}</p>

                      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Your answers">
                        {quoteSteps.map((s) =>
                          answers[s.id] ? (
                            <li key={s.id} className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                              {optionLabel(s.id, answers[s.id])}
                            </li>
                          ) : null,
                        )}
                      </ul>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <Field id="q-name" label="Name" autoComplete="name" placeholder="Your name" className="sm:col-span-2" {...contact.field("name")} />
                        <Field id="q-phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(727) 000-0000" {...contact.field("phone")} />
                        <Field id="q-zip" label="ZIP code" inputMode="numeric" autoComplete="postal-code" placeholder="33755" maxLength={5} {...contact.field("zip")} />
                        <Field id="q-email" label="Email" type="email" inputMode="email" autoComplete="email" placeholder="you@email.com" className="sm:col-span-2" {...contact.field("email")} />
                        <Field
                          id="q-message"
                          label="Anything else we should know?"
                          optional
                          multiline
                          placeholder="Rooms, colors, timing…"
                          className="sm:col-span-2"
                          {...contact.field("message")}
                        />
                      </div>
                      <Honeypot value={contact.values.company} onChange={(v) => contact.set("company", v)} />

                      {submitError ? (
                        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                          {submitError}
                        </p>
                      ) : null}

                      <button type="submit" disabled={status === "submitting"} className="btn btn-primary mt-5 min-h-14 w-full text-[1.05rem] disabled:opacity-70">
                        {status === "submitting" ? (
                          <>
                            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> Sending…
                          </>
                        ) : (
                          <>
                            {contactStep.submitLabel} <ArrowRight className="h-5 w-5" aria-hidden="true" />
                          </>
                        )}
                      </button>
                      <p className="mt-3 text-center text-xs text-muted">We only use your details to respond to your quote request.</p>
                    </form>
                  )}
                </m.div>
              </AnimatePresence>

              {step > 0 ? (
                <div className="mt-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-display font-semibold text-navy-800 hover:text-teal-700"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                  </button>
                  {!isContactStep && current && answers[current.id] ? (
                    <button
                      type="button"
                      onClick={() => goTo(step + 1)}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-display font-semibold text-teal-700 hover:text-teal-600"
                    >
                      Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              ) : answers[quoteSteps[0].id] ? (
                <div className="mt-5 flex justify-end">
                  <button type="button" onClick={() => goTo(1)} className="inline-flex min-h-11 items-center gap-1.5 font-display font-semibold text-teal-700">
                    Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </LazyMotion>
  );
}
