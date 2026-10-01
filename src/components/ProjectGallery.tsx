"use client";

import Image from "next/image";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { galleryFilters, galleryItems, type GalleryItem } from "@/config/projects";
import { trackEvent } from "@/lib/analytics";
import { QuoteButton } from "./QuoteButton";
import { SectionHeading } from "./SectionHeading";

type Filter = (typeof galleryFilters)[number]["value"];

function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const item = items[index];
  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Tab") {
        // keep focus inside the dialog
        const focusables = Array.from(document.querySelectorAll<HTMLElement>("[data-lightbox] button"));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  return (
    <m.div
      data-lightbox
      role="dialog"
      aria-modal="true"
      aria-label={`Project photo: ${item.caption}`}
      className="fixed inset-0 z-[60] flex flex-col bg-navy-950/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
        <p className="font-display text-sm font-medium text-white/80" aria-live="polite">
          {index + 1} / {items.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          aria-label="Close gallery"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div
        className="relative flex flex-1 touch-pan-y items-center justify-center px-2 pb-4 sm:px-20"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          if (!start) return;
          const dx = e.changedTouches[0].clientX - start.x;
          const dy = e.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.figure
            key={item.src}
            className="relative flex max-h-full w-full max-w-5xl flex-col items-center"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="relative w-full" style={{ aspectRatio: `${item.width} / ${item.height}`, maxHeight: "calc(100dvh - 170px)" }}>
              <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 1024px, 100vw" className="rounded-xl object-contain" />
            </div>
            <figcaption className="mt-3 text-center font-display text-base font-medium text-white">{item.caption}</figcaption>
          </m.figure>
        </AnimatePresence>

        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:flex"
        >
          <ChevronLeft className="h-7 w-7" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:flex"
        >
          <ChevronRight className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>
      <div className="flex items-center justify-center gap-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:hidden">
        <button type="button" onClick={prev} aria-label="Previous photo" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
          <ChevronLeft className="h-7 w-7" aria-hidden="true" />
        </button>
        <span className="text-sm text-white/70">Swipe to browse</span>
        <button type="button" onClick={next} aria-label="Next photo" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
          <ChevronRight className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>
    </m.div>
  );
}

export function ProjectGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = useMemo(() => (filter === "all" ? galleryItems : galleryItems.filter((i) => i.category === filter)), [filter]);

  const open = (i: number) => {
    setOpenIndex(i);
    trackEvent("gallery_viewed", { image: items[i].src, filter });
  };

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-cloud py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          id="gallery-title"
          eyebrow="Our work"
          title="Real Results."
          highlight="Happier Homes."
          description="Interior rooms, exteriors and kitchen cabinets — take a look around."
        />

        <div role="group" aria-label="Filter projects" className="mx-auto mt-9 flex max-w-md justify-center gap-1 rounded-full bg-white p-1.5 shadow-card">
          {galleryFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`min-h-10 flex-1 rounded-full px-3 font-display text-[0.92rem] font-semibold transition-colors sm:px-4 ${
                filter === f.value ? "bg-navy-950 text-white" : "text-navy-900 hover:bg-teal-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {items.map((item, i) => (
            <li
              key={item.src}
              className={i === 0 ? (filter === "all" ? "col-span-2 lg:row-span-2" : items.length % 2 ? "col-span-2 lg:col-span-1" : "") : ""}
            >
              <button
                type="button"
                onClick={() => open(i)}
                className="group relative block h-full w-full overflow-hidden rounded-xl bg-white text-left sm:rounded-2xl"
                aria-label={`View larger: ${item.caption}`}
              >
                <span className={`relative block w-full ${i === 0 && filter === "all" ? "aspect-[4/3] lg:aspect-auto lg:h-full" : "aspect-[4/3]"}`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={i === 0 && filter === "all" ? "(min-width: 1024px) 760px, 100vw" : "(min-width: 1024px) 380px, 50vw"}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent p-3 pt-10 sm:p-4 sm:pt-12">
                  <span className="font-display text-sm font-semibold text-white sm:text-base">{item.caption}</span>
                  <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur sm:flex">
                    <Expand className="h-4 w-4" aria-hidden="true" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <QuoteButton source="gallery">Get a Free Quote</QuoteButton>
        </div>
      </div>

      <LazyMotion features={domAnimation} strict>
        <AnimatePresence>
          {openIndex !== null ? (
            <Lightbox items={items} index={openIndex} onIndex={setOpenIndex} onClose={() => setOpenIndex(null)} />
          ) : null}
        </AnimatePresence>
      </LazyMotion>
    </section>
  );
}
