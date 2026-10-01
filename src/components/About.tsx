import Image from "next/image";
import { Check } from "lucide-react";
import { about } from "@/config/content";
import { QuoteButton } from "./QuoteButton";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-16 sm:py-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift lg:aspect-[5/4]">
            <Image
              src={about.image.src}
              alt={about.image.alt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover object-[30%_center]"
            />
          </div>
          <div aria-hidden="true" className="absolute -bottom-4 -right-4 -z-10 h-2/3 w-2/3 rounded-3xl bg-teal-100 sm:-bottom-6 sm:-right-6" />
        </div>
        <div>
          <SectionHeading id="about-title" eyebrow={about.eyebrow} title={about.title} align="left" />
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">{about.body}</p>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2">
            {about.points.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display font-semibold text-navy-950">{p.title}</span>
                  <span className="mt-0.5 block text-[0.95rem] text-muted">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <QuoteButton source="about" className="btn btn-primary mt-8" />
        </div>
      </div>
    </section>
  );
}
