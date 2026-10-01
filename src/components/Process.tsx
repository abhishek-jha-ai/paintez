import { processSteps } from "@/config/content";
import { SectionHeading } from "./SectionHeading";

export function Process() {
  return (
    <section aria-labelledby="process-title" className="bg-teal-50/70 py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading id="process-title" eyebrow="How it works" title="A Simple," highlight="Easy Process" />
        <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-9 hidden border-t-2 border-dashed border-teal-200 lg:block" />
          {processSteps.map((s) => (
            <li key={s.number} className="relative rounded-2xl bg-white p-6 shadow-card lg:bg-transparent lg:p-0 lg:text-center lg:shadow-none">
              <span className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-navy-950 font-display text-2xl font-bold text-white ring-8 ring-teal-50 lg:mx-auto">
                {s.number}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-navy-950">{s.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted lg:mx-auto lg:max-w-[15rem]">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
