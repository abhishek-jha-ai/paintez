"use client";

import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { beforeAfterProjects, type BeforeAfterProject } from "@/config/projects";
import { trackEvent } from "@/lib/analytics";
import { QuoteButton } from "./QuoteButton";
import { SectionHeading } from "./SectionHeading";

const clamp = (n: number) => Math.min(100, Math.max(0, n));

function CompareSlider({ project, onUse }: { project: BeforeAfterProject; onUse: () => void }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const start = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const [pos, setPos] = useState(50);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const markUsed = useCallback(() => {
    if (touched.current) return;
    touched.current = true;
    onUse();
  }, [onUse]);

  // One gentle sweep the first time the slider scrolls into view, so it's obvious it moves.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          if (touched.current) return;
          const t = Math.min(1, (now - start) / 1600);
          setPos(50 + Math.sin(t * Math.PI * 2) * 14 * (1 - t));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className="relative aspect-[4/5] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-2xl bg-cloud shadow-lift sm:aspect-[4/3] lg:aspect-[5/4]"
      onPointerDown={(e) => {
        dragging.current = true;
        start.current = { x: e.clientX, y: e.clientY, moved: false };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        // Mouse/pen jump straight to the cursor; touch waits for a horizontal drag so page scrolling still works.
        if (e.pointerType !== "touch") {
          markUsed();
          setFromClientX(e.clientX);
        }
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        const s = start.current;
        if (s && !s.moved && Math.abs(e.clientX - s.x) < 4) return;
        if (s) s.moved = true;
        markUsed();
        setFromClientX(e.clientX);
      }}
      onPointerUp={(e) => {
        // A tap (no drag) on touch moves the divider to that spot.
        if (dragging.current && e.pointerType === "touch" && !start.current?.moved) {
          markUsed();
          setFromClientX(e.clientX);
        }
        dragging.current = false;
      }}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* AFTER (base layer) */}
      <Image
        src={project.after.src}
        alt={project.after.alt}
        fill
        sizes="(min-width: 1024px) 680px, 100vw"
        draggable={false}
        className="pointer-events-none object-cover"
        style={{ objectPosition: project.focus }}
      />
      {/* BEFORE (clipped on top) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image
          src={project.before.src}
          alt={project.before.alt}
          fill
          sizes="(min-width: 1024px) 680px, 100vw"
          draggable={false}
          className="pointer-events-none object-cover"
          style={{ objectPosition: project.focus }}
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-lg bg-navy-950/85 px-3 py-1.5 font-display text-sm font-semibold text-white sm:left-4 sm:top-4">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-lg bg-teal-600 px-3 py-1.5 font-display text-sm font-semibold text-white sm:right-4 sm:top-4">
        After
      </span>

      {/* divider + handle */}
      <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_12px_rgb(0_0_0/0.35)]" style={{ left: `${pos}%` }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Compare before and after: ${project.title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% before`}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 4;
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPos((p) => clamp(p - step));
          else if (e.key === "ArrowRight" || e.key === "ArrowUp") setPos((p) => clamp(p + step));
          else if (e.key === "Home") setPos(0);
          else if (e.key === "End") setPos(100);
          else return;
          e.preventDefault();
          markUsed();
        }}
        className="absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-teal-600 text-white shadow-lift"
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal className="h-6 w-6" aria-hidden="true" />
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const [activeId, setActiveId] = useState(beforeAfterProjects[0].id);
  const active = beforeAfterProjects.find((p) => p.id === activeId) ?? beforeAfterProjects[0];

  return (
    <section id="our-work" aria-labelledby="before-after-title" className="bg-teal-50/70 py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          id="before-after-title"
          eyebrow="Before & after"
          title="See the"
          highlight="Difference"
          description="Drag the slider to compare. A fresh coat of paint can completely change how a room — or a whole home — feels."
        />

        <div className="mt-10 grid items-center gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            {beforeAfterProjects.length > 1 ? (
              <div role="group" aria-label="Before and after projects" className="mb-4 flex gap-2 lg:hidden">
                {beforeAfterProjects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={p.id === active.id}
                    onClick={() => setActiveId(p.id)}
                    className={`min-h-11 flex-1 rounded-full px-4 font-display text-[0.95rem] font-semibold transition-colors ${
                      p.id === active.id ? "bg-navy-950 text-white" : "bg-white text-navy-900 shadow-card"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            ) : null}
            <CompareSlider
              key={active.id}
              project={active}
              onUse={() => trackEvent("before_after_used", { project: active.id })}
            />
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted lg:hidden">
              <MoveHorizontal className="h-4 w-4 text-teal-600" aria-hidden="true" /> Drag to compare
            </p>
          </div>

          <div>
            <div role="group" aria-label="Before and after projects" className="hidden flex-col gap-3 lg:flex">
              {beforeAfterProjects.map((p) => {
                const selected = p.id === active.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveId(p.id)}
                    className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition-all ${
                      selected ? "border-teal-500 bg-white shadow-lift" : "border-transparent bg-white/60 hover:bg-white"
                    }`}
                  >
                    <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image src={p.after.src} alt="" fill sizes="80px" className="object-cover" />
                    </span>
                    <span>
                      <span className="eyebrow block !text-[0.7rem]">{p.label}</span>
                      <span className="mt-1 block font-display text-lg font-semibold text-navy-950">{p.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-card lg:mt-6 lg:bg-transparent lg:p-0 lg:shadow-none">
              <h3 className="font-display text-xl font-bold text-navy-950 lg:hidden">{active.title}</h3>
              <p className="mt-2 leading-relaxed text-muted lg:mt-0">{active.description}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <QuoteButton source="before_after" className="btn btn-primary min-h-13">
                  Get a Free Quote
                </QuoteButton>
                <a href="#gallery" className="btn btn-secondary min-h-13">
                  View the gallery
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
