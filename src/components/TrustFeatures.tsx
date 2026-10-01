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
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((f) => (
            <li key={f.title} className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Icon name={f.icon} className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-navy-950">{f.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
