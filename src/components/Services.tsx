import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { services } from "@/config/content";
import { Icon } from "./Icon";
import { QuoteButton } from "./QuoteButton";
import { SectionHeading } from "./SectionHeading";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          id="services-title"
          eyebrow="Our services"
          title="Complete Painting Services for"
          highlight="Your Home"
          description="House painting in Clearwater, from single rooms to full exteriors and kitchen cabinets."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.id}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-shadow hover:shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden bg-cloud sm:aspect-[7/8]">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="relative flex flex-1 flex-col px-5 pb-5 pt-9">
                  <span className="absolute -top-7 left-5 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-teal-600 text-white shadow-card">
                    <Icon name={service.icon} className="h-6 w-6" strokeWidth={1.9} />
                  </span>
                  <h3 className="font-display text-xl font-bold text-navy-950">{service.title}</h3>
                  <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-muted">{service.description}</p>
                  <QuoteButton
                    source={`service_${service.id}`}
                    service={service.quoteValue}
                    arrow={false}
                    className="mt-4 inline-flex items-center gap-2 self-start rounded-full font-display text-[0.95rem] font-semibold text-teal-700 after:absolute after:inset-0 after:content-[''] hover:text-teal-600"
                  >
                    Get a {service.id === "more" ? "" : `${service.title.split(" ")[0].toLowerCase()} `}quote
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </QuoteButton>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
