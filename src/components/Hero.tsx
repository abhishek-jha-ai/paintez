import Image from "next/image";
import { MapPin } from "lucide-react";
import { hero } from "@/config/content";
import { QuoteButton } from "./QuoteButton";

export function BrushUnderline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 16" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M3 11.5C58 6.2 118 3.8 178 4.2c41 .3 80 2.4 119 6.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate bg-white lg:min-h-[640px]">
      <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[72%_30%] lg:object-[68%_35%]"
        />
        {/* readability wash for the desktop text column */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg,#fff 0%,rgba(255,255,255,.94) 34%,rgba(255,255,255,.55) 50%,rgba(255,255,255,0) 64%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-white/0 lg:hidden" />
        <div className="absolute right-3 top-3 hidden items-center gap-2 rounded-xl bg-navy-950/90 px-3.5 py-2.5 text-white shadow-lift sm:flex lg:right-8 lg:top-8">
          <MapPin className="h-5 w-5 text-teal-400" aria-hidden="true" />
          <span className="leading-tight">
            <span className="block text-xs text-white/80">{hero.badge.line1}</span>
            <span className="block font-display text-[0.95rem] font-semibold">{hero.badge.line2}</span>
          </span>
        </div>
      </div>

      <div className="container-page relative pb-8 pt-1 lg:flex lg:min-h-[640px] lg:items-center lg:pb-28 lg:pt-12">
        <div className="max-w-xl">
          <h1 id="hero-title" className="font-display text-navy-950">
            <span className="eyebrow block text-[0.78rem] sm:text-sm">{hero.eyebrow}</span>
            <span className="relative mt-2 inline-block text-[2.75rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              {hero.title}
              <BrushUnderline className="absolute -bottom-2.5 left-0 h-3 w-full text-teal-500 sm:-bottom-3 sm:h-4" />
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-muted sm:text-lg">{hero.description}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <QuoteButton source="hero" className="btn btn-primary min-h-14 px-7 text-[1.05rem]">
              {hero.primaryCta.label}
            </QuoteButton>
            <a href={hero.secondaryCta.href} className="btn btn-secondary min-h-14 px-7 text-[1.05rem]">
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
