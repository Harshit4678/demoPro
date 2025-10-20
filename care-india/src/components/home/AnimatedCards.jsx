// File: src/components/BeginTheChange.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { students } from "@/data/girls";
import { useThemeStore } from "@/stores/themeStore";

/* helper to convert #rrggbb to "r,g,b" */
function hexToRgb(hex = "#FF9933") {
  try {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `${r},${g},${b}`;
  } catch (e) {
    return "255,153,51";
  }
}

/**
 * BeginTheChange
 * - Theme fully controlled by useThemeStore
 * - Minimal, theme-driven background and shadows
 */
export default function BeginTheChange() {
  const base = useMemo(() => students.slice(0, 15), []);
  const n = base.length;
  const triple = useMemo(() => [...base, ...base, ...base], [base]);
  const [active, setActive] = useState(n); // start from middle block
  const [isPaused, setIsPaused] = useState(false);
  const [withTransition, setWithTransition] = useState(true);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  // Theme from store (single source of truth)
  const { saffronMid, emeraldMid, GRAD, GRAD_SOFT, ink } = useThemeStore();
  const saffron = saffronMid ?? "#FF8C1A";
  const emerald = emeraldMid ?? "#0EA765";
  const grad = GRAD ?? `linear-gradient(135deg, ${saffron} 0%, ${saffron} 40%, ${emerald} 100%)`;
  const gradSoft = GRAD_SOFT ?? `linear-gradient(135deg, ${saffron}22 0%, ${emerald}44 100%)`;
  const inkColor = ink ?? "#0f172a";

  // precompute rgb for shadows
  const brandRgb = hexToRgb(saffron);
  const emeraldRgb = hexToRgb(emerald);

  // Sizes
  const CARD_W = 320; // width
  const GAP = 20; // gap
  const STEP = CARD_W + GAP;
  const CARD_H = 420;
  const CONTAINER_H = 480;

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => next(), 2600);
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  const next = () => setActive((p) => p + 1);
  const prev = () => setActive((p) => p - 1);

  // Jump logic to keep index in the middle block
  useEffect(() => {
    if (!trackRef.current) return;
    const tooRight = active >= 2 * n;
    const tooLeft = active < n;
    if (tooRight || tooLeft) {
      const handle = () => {
        setWithTransition(false);
        setActive((p) => (p % n) + n);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setWithTransition(true));
        });
        trackRef.current?.removeEventListener("transitionend", handle);
      };
      trackRef.current.addEventListener("transitionend", handle);
    }
  }, [active, n]);

  // Translate calculation (center the active card)
  const translate = `translateX(calc(50% - ${CARD_W / 2}px - ${active * STEP}px))`;

  // Hover pause
  const onEnter = () => setIsPaused(true);
  const onLeave = () => setIsPaused(false);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      className="relative py-14"
      aria-label="Begin the change"
      style={{
        // export theme variables to CSS for child components
        ["--saffron"]: saffron,
        ["--emerald"]: emerald,
        ["--grad"]: grad,
        ["--grad-soft"]: gradSoft,
        ["--brand-rgb"]: brandRgb,
        ["--emerald-rgb"]: emeraldRgb,
        ["--ink"]: inkColor,
        // simple theme-driven background: soft band + white base
        background: `linear-gradient(180deg, #ffffff 0%, #ffffff 100%), var(--grad-soft)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-10">
          <h2
            className="text-4xl md:text-5xl font-light tracking-tight bg-clip-text text-transparent pb-2"
            style={{ backgroundImage: `var(--grad)` }}
          >
            Begin the Change
          </h2>
          <p className="mt-4 text-gray-600 max-w-4xl mx-auto">
            "Begin the Change" emphasizes that even the tiniest donation or gesture of kindness can spark a wave of transformation. Every little action counts and adds to a larger purpose, leading to significant change. When we unite, we can profoundly affect the lives of women, children, and the elderly. Whether through volunteering, donating, or spreading awareness, each effort is vital in creating a brighter, more inclusive future for those who need it the most.
          </p>
        </header>

        <div className="relative">
          {/* Controls */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm" style={{ color: "var(--ink)" }}>
              {String(((active % n) + n) % n + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="rounded-xl border px-3 py-2 shadow-sm hover:shadow transition active:scale-[0.98]"
                aria-label="Previous"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button
                onClick={next}
                className="rounded-xl border px-3 py-2 shadow-sm hover:shadow transition active:scale-[0.98]"
                aria-label="Next"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div
            className="relative overflow-hidden"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            style={{ height: CONTAINER_H }}
          >
            <div
              ref={trackRef}
              className="flex items-center will-change-transform"
              style={{
                transform: translate,
                transition: withTransition ? "transform 700ms cubic-bezier(.22,1,.36,1)" : "none",
                height: CONTAINER_H,
              }}
            >
              {triple.map((s, idx) => {
                const isActive = idx === active;
                const dist = Math.abs(idx - active);
                const scale = isActive ? 1.12 : Math.max(0.88, 1 - dist * 0.06);
                const op = isActive ? 1 : Math.max(0.55, 1 - dist * 0.15);
                return (
                  <AdvancedCard
                    key={`${s.id}-${idx}`}
                    student={s}
                    width={CARD_W}
                    height={CARD_H}
                    gap={GAP}
                    isActive={isActive}
                    scale={scale}
                    opacity={op}
                    // supply theme values (optional — CSS vars are main source)
                    saffron={saffron}
                    emerald={emerald}
                    grad={grad}
                    gradSoft={gradSoft}
                  />
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {base.map((_, i) => {
              const curr = ((active % n) + n) % n;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i + n)}
                  className={`w-3 h-3 rounded-full ${i === curr ? "" : "bg-gray-300"}`}
                  aria-label={`Go to ${i + 1}`}
                  style={{ background: i === curr ? saffron : undefined }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* small helpers for reduced motion/accessibility */
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }

        /* AdvancedCard visuals use CSS variables from component root */
        .advanced-card {
          box-sizing: border-box;
          border-radius: 1rem;
          background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.85));
          border: 1px solid rgba(0,0,0,0.04);
          transition: transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms;
        }
        .advanced-card .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 1rem;
        }

        /* theme-driven shadow / hover */
        .advanced-card {
          box-shadow: 0 10px 30px rgba(var(--brand-rgb), 0.06), 0 6px 18px rgba(0,0,0,0.06);
        }
        .advanced-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 18px 40px rgba(var(--brand-rgb), 0.12), 0 10px 28px rgba(var(--emerald-rgb), 0.06);
        }

        .advanced-card .img-wrap img { display: block; width: 100%; height: 100%; object-fit: cover; }

        /* subtle hover glow (soft, from theme) */
        .advanced-card .hover-glow {
          position: absolute;
          inset: -18px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 280ms;
          border-radius: 1rem;
          filter: blur(14px);
        }
        .advanced-card:hover .hover-glow { opacity: 1; background: radial-gradient(400px 140px at 50% 20%, var(--saffron)22, transparent 50%), radial-gradient(360px 120px at 50% 80%, var(--emerald)22, transparent 50%); }

        /* smaller screens adjustments */
        @media (max-width: 1024px) {
          .advanced-card { transform: none !important; }
        }
      `}</style>
    </section>
  );
}

/* -------------------------
   AdvancedCard (stateless)
   ------------------------- */
function AdvancedCard({
  student,
  width,
  height,
  isActive,
  scale,
  opacity,
}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
      el.style.setProperty("--px", `${x}px`);
      el.style.setProperty("--py", `${y}px`);
    };
    const onLeave = () => {
      el.style.setProperty("--px", `0px`);
      el.style.setProperty("--py", `0px`);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="advanced-card flex-shrink-0 mr-[20px]"
      style={{
        width,
        height,
        transform: `scale(${scale})`,
        opacity,
      }}
      aria-hidden={!isActive}
    >
      <div className="card-inner p-4 rounded-2xl">
        <div className="hover-glow" aria-hidden />
        <div className="relative w-full h-[260px] rounded-lg overflow-hidden img-wrap">
          <img src={student.img} alt={student.name} loading="lazy" style={{ transform: "translate3d(var(--px), var(--py), 0) scale(1.05)", willChange: "transform" }} />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        <div className="relative z-10 mt-4 flex flex-col items-center justify-center text-center max-w-[90%] mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 leading-tight line-clamp-1 w-full">{student.name}</h3>
          {isActive && <p className="mt-2 text-sm text-gray-600 line-clamp-4">{student.short}</p>}
          <div className="mt-3 flex items-center justify-center gap-2">
            <Link href={`/students/${student.slug}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm shadow" style={{ backgroundImage: `var(--grad)` }}>
              View Story
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
