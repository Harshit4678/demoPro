// src/components/FocusAreaSection.jsx
"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import InteractiveBottomCards from "./InteractiveFocusCards";
import { useThemeStore } from "@/stores/themeStore"; // adjust path if needed

/* --- Lightweight Lottie wrapper (uses lottie-web directly) --- */
function LottieAnim({ src, className = "" }) {
  const boxRef = useRef(null);

  useEffect(() => {
    let anim;
    let cancelled = false;

    (async () => {
      const lottie = (await import("lottie-web")).default;
      if (cancelled || !boxRef.current) return;
      anim = lottie.loadAnimation({
        container: boxRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: src,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          progressiveLoad: true,
          hideOnTransparent: true,
        },
      });
    })();

    return () => {
      cancelled = true;
      if (anim) anim.destroy();
    };
  }, [src]);

  return <div ref={boxRef} className={className} aria-label="lottie animation" />;
}

const DATA = [
  {
    id: "women",
    title: "Women Empowerment",
    short: "Self-help groups, training & microloans.",
    lottie: "/lottie/cardlogos/womenpower.json",
    details:
      "Capacity building, self-help groups and leadership programmes to empower women socially & economically. We run training, small loans and market linkages.",
    accent: "#ef4444",
    pillar: "women",
  },
  {
    id: "elderly",
    title: "Old Age Assistance",
    short: "Healthcare, nutrition & companionship.",
    lottie: "/lottie/cardlogos/elderly-assistance.json",
    details:
      "Support services, healthcare access and community activities for senior citizens to ensure dignity, nutrition and social inclusion.",
    accent: "#f59e0b",
    pillar: "elderly",
  },
  {
    id: "disaster",
    title: "Disaster Relief",
    short: "Rapid response and rehab.",
    lottie: "/lottie/cardlogos/disaster-relief.json",
    details:
      "Rapid response relief, rehabilitation and resilience-building in disaster-affected areas, including shelter and restoration support.",
    accent: "#06b6d4",
    pillar: "disaster",
  },
  {
    id: "child-sponsorship",
    title: "Child Sponsorship",
    short: "Long-term care for children.",
    lottie: "/lottie/cardlogos/child-sponsorship.json",
    details:
      "Long-term sponsorship programs to ensure nutrition, education and psychosocial support for children enabling stable growth and learning.",
    accent: "#8b5cf6",
    pillar: "children",
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "women", label: "Women" },
  { key: "children", label: "Children" },
  { key: "elderly", label: "Elderly" },
  { key: "disaster", label: "Disaster" },
];

function useParallaxVars(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.setProperty("--mx", (x * 20).toFixed(2) + "px");
      el.style.setProperty("--my", (y * 20).toFixed(2) + "px");
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [ref]);
}

function FlipCard180({ item, size = "md" }) {
  const [open, setOpen] = useState(false);
  const dims = size === "lg" ? "min-h-[20rem]" : "min-h-[16rem]";

  // safe accent fallback will be provided by parent via CSS var --accent (set below)
  return (
    <div
      className={`group relative ${dims} rounded-2xl [perspective:1200px] select-none`}
      style={{ ["--accent"]: item.__resolvedAccent ?? item.accent }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((s) => !s)}
      tabIndex={0}
      aria-expanded={open}
    >
      {/* Glow */}
      <span
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-60 transition duration-500"
        style={{
          background:
            "conic-gradient(from 200deg at 20% 10%, var(--grad) 0%, transparent 25%, var(--accent), transparent 60%, var(--grad))",
          filter: open ? "blur(12px)" : "blur(8px)",
        }}
      />

      {/* Shell */}
      <div className="absolute inset-0 rounded-2xl bg-white ring-1 ring-black/5 shadow overflow-hidden">
        {/* 3D flip wrapper */}
        <div
          className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-500 ease-out"
          style={{ transform: open ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 p-5 grid grid-rows-[auto_1fr_auto] items-center text-center [backface-visibility:hidden] bg-white/90">
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>

            {/* Lottie container */}
            <div className="place-self-center w-60 h-44 md:w-50 md:h-50 rounded-2xl bg-gray-50 grid place-items-center overflow-hidden shadow-inner">
              <LottieAnim src={item.lottie} className="w-full h-full" />
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mt-2">{item.short}</p>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 p-5 grid content-center text-left [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--grad-soft) 70%, white) 0%, color-mix(in oklab, var(--accent) 80%, white) 100%)",
            }}
          >
            <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-1">
              {item.title}
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed pr-1">{item.details}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FocusAreaSection() {
  const [filter, setFilter] = useState("all");
  const wrap = useRef(null);
  useParallaxVars(wrap);

  // theme from store
  const {
    saffronMid,
    emeraldMid,
    grad, // single color used for color-mix / glows
    gradSoft,
    ink,
    accentDefaults,
  } = useThemeStore();

  const items = useMemo(
    () => (filter === "all" ? DATA : DATA.filter((d) => d.pillar === filter)),
    [filter]
  );

  // resolve accents (apply fallback from accentDefaults when item.accent missing)
  const resolvedItems = useMemo(() => {
    return items.map((it) => {
      const resolvedAccent = it.accent ?? (accentDefaults && accentDefaults[it.pillar]) ?? (accentDefaults && accentDefaults.default) ?? saffronMid;
      return { ...it, __resolvedAccent: resolvedAccent };
    });
  }, [items, accentDefaults, saffronMid]);

  const feature = resolvedItems[0] ?? { ...DATA[0], __resolvedAccent: DATA[0].accent };
  const rest = resolvedItems.slice(1);

  return (
    <section
      ref={wrap}
      className="relative overflow-hidden  py-8 md:py-20 md:px-10 my-1"
      style={{
        // map store values to CSS variables used in the component
        ["--brand"]: saffronMid ?? "#FF9933",
        ["--emerald"]: emeraldMid ?? "#10b981",
        ["--grad"]: grad ?? "#ffbf66",
        ["--grad-soft"]: gradSoft ?? "#fff1e0",
        ["--ink"]: ink ?? "#0f172a",
      }}
    >
      {/* Parallax background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -inset-24 opacity-60"
          style={{
            background:
              "radial-gradient(40% 30% at 15% 0%, color-mix(in oklab, var(--grad) 28%, transparent), transparent 70%), radial-gradient(35% 30% at 90% 85%, color-mix(in oklab, var(--emerald) 22%, transparent), transparent 70%)",
            filter: "blur(30px)",
            transform: "translate3d(var(--mx,0), var(--my,0), 0)",
            transition: "transform 120ms ease-out",
          }}
        />
        <div className="absolute inset-0 opacity-[0.06] [background:repeating-linear-gradient(90deg,transparent_0,transparent_34px,rgba(0,0,0,.07)_34px,rgba(0,0,0,.07)_35px)]" />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-[minmax(280px,340px)_1fr] gap-10">
        {/* Sticky left rail */}
        <aside className="lg:sticky lg:top-20 self-start space-y-6 ">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg, var(--brand), var(--emerald))" }}
          >
            <span>Impact Pillars</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight">
            <span
              className="bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--brand),#ffbf66,var(--emerald))] [background-size:200%_100%] animate-[shine_2800ms_ease-in-out_infinite]  "
            >
              Our Focus Areas
            </span>
          </h2>
          <p className="text-slate-700 leading-relaxed">
            We focus on multi-dimensional programs that uplift communities — from healthcare and education to livelihood and rapid disaster response.
          </p>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-3">
            {[{ n: "1.2L+", l: "Beneficiaries" }, { n: "120+", l: "Districts" }, { n: "9+", l: "Years" }].map(
              (m) => (
                <div key={m.l} className="rounded-xl border border-black/5 bg-white p-3 text-center shadow-sm">
                  <div className="text-xl font-extrabold text-slate-900">{m.n}</div>
                  <div className="text-xs text-slate-600">{m.l}</div>
                </div>
              )
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 pt-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition border ${
                  filter === f.key ? "text-white border-transparent" : "text-slate-700 border-black/10 bg-white"
                }`}
                style={{
                  background: filter === f.key ? "linear-gradient(135deg,var(--brand),var(--emerald))" : undefined,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Right: asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="md:col-span-2 xl:col-span-2 xl:row-span-2">
            <FlipCard180 item={feature} size="lg" />
          </div>
          {rest.map((it) => (
            <FlipCard180 key={it.id} item={it} />
          ))}
        </div>
      </div>

      {/* Existing interactive strip below */}
      <div className="mt-16">
        <InteractiveBottomCards />
      </div>

      {/* keyframes */}
      <style jsx global>{`
        @keyframes shine {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        @media (prefers-reduced-motion: reduce){
          .group * { animation: none !important; transition: none !important }
        }
      `}</style>
    </section>
  );
}
