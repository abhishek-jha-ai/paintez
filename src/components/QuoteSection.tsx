import { Check } from "lucide-react";
import { QuoteWizard } from "./QuoteWizard";

const reassurance = ["5 quick questions — about a minute", "Free quote for your project", "Local Clearwater painters"];

export function QuoteSection() {
  return (
    <section id="quote" aria-labelledby="quote-title" className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-teal-500/20 blur-3xl"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-40 h-[420px] w-[420px] rounded-full bg-teal-500/10 blur-3xl" />
      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <p className="eyebrow !text-teal-400">Free quote</p>
          <h2 id="quote-title" className="mt-3 font-display text-[2.1rem] font-bold leading-[1.08] tracking-tight sm:text-5xl">
            Get your free painting quote
          </h2>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-white/75">
            Tell us a little about your home and what you&apos;d like painted. It only takes a minute — no long forms.
          </p>
          <ul className="mt-7 grid gap-3">
            {reassurance.map((item) => (
              <li key={item} className="flex items-center gap-3 font-display font-medium">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/15 text-teal-400">
                  <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <QuoteWizard />
      </div>
    </section>
  );
}
