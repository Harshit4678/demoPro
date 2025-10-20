// components/PerformanceStats.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { useThemeStore } from "@/stores/themeStore";

/* -------- Helpers -------- */
function formatIndianShort(num) {
  if (num >= 100000) {
    const lakh = num / 100000;
    const str = Number(lakh.toFixed(lakh < 10 ? 2 : 1)).toString();
    return `${str} Lakh+`;
  } else if (num >= 1000) {
    const th = num / 1000;
    const str = Number(th.toFixed(th < 10 ? 2 : 0)).toString();
    return `${str} Thousand+`;
  }
  return `${num}+`;
}

/* Count-up as a component (so hooks-in-loop issue na ho) */
function CountUp({ to, run, duration = 1.4, formatter = (v) => v }) {
  const [val, setVal] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!run) return;

    animRef.current?.stop?.();

    if (prefersReduced) {
      setVal(to);
      return;
    }

    animRef.current = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });

    return () => animRef.current?.stop?.();
  }, [run, to, duration]);

  return <>{formatter(val)}</>;
}

/* Single stat card */
function StatCard({ item, index, total, inView }) {
  return (
    <motion.div
      className="relative rounded-2xl p-5 sm:p-6 text-center bg-white/8 backdrop-blur-md border border-white/20 shadow-md hover:shadow-lg transition-shadow duration-300"
      variants={{
        hidden: { y: 18, opacity: 0 },
        show: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      whileHover={{ y: -6 }}
    >
      {index < total - 1 && (
        <div className="hidden lg:block absolute right-0 top-1/5 bottom-1/5 w-[1px] bg-white/20" />
      )}

      <h3 className="text-xs md:text-sm font-semibold tracking-wider text-amber-300 uppercase">
        {item.title}
      </h3>

      <p className="mt-2 font-light leading-tight select-none tracking-tight text-2xl sm:text-3xl md:text-4xl">
        <CountUp to={item.target} run={inView} formatter={formatIndianShort} />
      </p>

      <p className="mt-1 text-xs md:text-sm text-gray-200/90">{item.sub}</p>
    </motion.div>
  );
}

/* -------- Main component -------- */
export default function PerformanceStats(props) {
  const { stats: statsProp, bgImage = "/images/education.jpg", api } = props || {};

  const saffron = useThemeStore((s) => s.saffronMid);
  const emerald = useThemeStore((s) => s.emeraldMid);
  const GRAD = useThemeStore((s) => s.GRAD);

  const animatedId = useMemo(() => `gradAnim_${Math.random().toString(36).slice(2, 9)}`, []);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  const fallbackStats = useMemo(
    () => [
      { title: "Impacting", target: 95000, sub: "Children" },
      { title: "Treated", target: 180000, sub: "Patients" },
      { title: "Empowered", target: 95000, sub: "Women" },
      { title: "Trained", target: 125000, sub: "Through Job Courses" },
    ],
    []
  );

  const [stats, setStats] = useState(statsProp || fallbackStats);

  // Optional API fetch for dynamic data
  useEffect(() => {
    let active = true;
    async function load() {
      if (!api) return;
      try {
        const res = await fetch(api, { cache: "no-store" });
        const json = await res.json();
        if (active && Array.isArray(json)) setStats(json);
      } catch {
        /* ignore — keep fallback */
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [api]);

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  /* inject animated gradient keyframes once */
  useEffect(() => {
    if (prefersReduced) return; // no animation if reduced
    const styleId = `perf-stats-style-${animatedId}`;
    if (document.getElementById(styleId)) return;
    const keyframes = `
      @keyframes ${animatedId} {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    const css = `
      #${styleId} { ${keyframes} }
    `;
    const el = document.createElement("style");
    el.id = styleId;
    el.innerHTML = `
      .animated-gradient-${animatedId} {
        background-image: linear-gradient(90deg, ${saffron}, ${emerald}, ${saffron});
        background-size: 300% 300%;
        animation: ${animatedId} 6s ease infinite;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
    `;
    document.head.appendChild(el);
    return () => {
      try { document.head.removeChild(el); } catch (e) { /* ignore */ }
    };
  }, [animatedId, saffron, emerald, prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] sm:min-h-screen flex items-center bg-cover bg-center bg-no-repeat overflow-hidden py-12 sm:py-20"
      style={{
        backgroundImage: `url('${bgImage}')`,
      }}
    >
      {/* Subtle zoom-out for BG */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
      />

      <div className="absolute inset-0 bg-black/55 lg:bg-black/45 backdrop-blur-[2px]" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 w-full text-white antialiased z-10">
    
<motion.header
  className="text-center mb-8 sm:mb-12 px-2"
  initial={{ y: 18, opacity: 0 }}
  animate={inView ? { y: 0, opacity: 1 } : {}}
  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
>
  {/* Inline style tag ensures CSS is present (no Tailwind purge issues) */}
  <style>{`
    /* animated gradient for heading (unique class to avoid collisions) */
    .pf-animated-grad {
      background-image: linear-gradient(90deg, ${saffron}, ${emerald}, ${saffron});
      background-size: 300% 300%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: pf-grad-move 6s ease infinite;
      will-change: background-position;
    }
    @keyframes pf-grad-move {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    /* respect reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .pf-animated-grad { animation: none !important; color: ${saffron}; -webkit-background-clip: unset; background-clip: unset; }
    }
  `}</style>

  <h2
    className="m-0 font-light text-3xl md:text-5xl leading-tight pf-animated-grad"
    style={{ letterSpacing: "-0.02em" }}
  >
    Our Performance in Numbers
  </h2>

  <p className="mt-2 text-sm sm:text-base text-gray-200 max-w-2xl mx-auto">
    Together, we’re making a measurable difference.
  </p>
</motion.header>


        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 "
          initial="hidden"
          animate={inView ? "show" : "hidden"} 
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {stats.map((item, i) => (
            <StatCard
            
              key={`${item.title}-${i}`}
              item={item}
              index={i}
              total={stats.length}
              inView={inView}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
