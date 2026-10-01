import { trustFeatures } from "@/config/content";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";

export function TrustFeatures() {
  return (
    <section aria-labelledby="trust-title" className="py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          id="trust-title"
          eyebrow="Why Paint EZ"
          title="A Painting Experience That's"
          highlight="Easy"
          description="Hiring a painter shouldn't be stressful. Here's what you can expect working with a local Clearwater team."
        />
        <ul className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {trustFeatures.map((f) => (
            <li key={f.title} className="flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:block sm:p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Icon name={f.icon} className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-navy-950 sm:mt-5">{f.title}</h3>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-muted sm:mt-2">{f.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
