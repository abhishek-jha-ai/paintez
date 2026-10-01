import { processSteps } from "@/config/content";
import { SectionHeading } from "./SectionHeading";

export function Process() {
  return (
    <section aria-labelledby="process-title" className="bg-teal-50/70 py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading id="process-title" eyebrow="How it works" title="A Simple," highlight="Easy Process" />
        <ol className="relative mt-10 grid gap-3 sm:mt-12 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-9 hidden border-t-2 border-dashed border-teal-200 lg:block" />
          {processSteps.map((s) => (
            <li
              key={s.number}
              className="relative flex gap-4 rounded-2xl bg-white p-5 shadow-card sm:block sm:p-6 lg:bg-transparent lg:p-0 lg:text-center lg:shadow-none"
            >
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-950 font-display text-lg font-bold text-white sm:h-[72px] sm:w-[72px] sm:text-2xl lg:mx-auto lg:ring-8 lg:ring-teal-50">
                {s.number}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-navy-950 sm:mt-5">{s.title}</h3>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-muted sm:mt-2 lg:mx-auto lg:max-w-[15rem]">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
