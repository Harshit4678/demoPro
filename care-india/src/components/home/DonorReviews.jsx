// components/DonorReviews.jsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/stores/themeStore";

/* --- sample donor data (kept as before) --- */
const DONORS = [
  { id: 1, name: "Rita Sharma", location: "Pune", photo: "", impact: ["₹50,000","5 Scholarships","Education"], short:"Transparent aur impact-driven initiative. Regular updates ne trust build kiya.", full:"CareIndia ke saath meri first donation thi. Har step par mujhe transparency mili: proper receipts, progress photos, aur beneficiaries ki choti-choti stories. Jo proposal diya gaya tha, wahi execute hua — bina delay ke. Is process ne mujhe confident banaya ki meri contribution sach me kisi ke kaam aa rahi hai.", date: "May 2025", rating: 5 },
  { id: 2, name: "Amit Verma", location: "Delhi", photo: "", impact: ["₹20,000","400 Meals","Hunger Relief"], short:"Execution fast aur organized — reports time par milti hain.", full:"Donation ke ek hafte ke andar ground se photos aayi aur concise utilization report bhi. Follow-ups structured the aur har query ka response timely mila. Mujhe laga ki team lean but efficient tarike se kaam karti hai, jo kaafi rare hai.", date: "Apr 2025", rating: 5 },
  { id: 3, name: "Sunita Kapoor", location: "Jaipur", photo: "", impact: ["₹15,000","Medical Kits","Healthcare"], short:"Ground team very supportive — dignity-first approach.", full:"Volunteers ki sincerity clearly dikh rahi thi. Beneficiaries ko portray karte waqt dignity maintain ki gayi; koi sensationalism nahi. Har rupee ka proper justification mila aur clear deliverables meet hue. Isiliye maine annual pledge continue kiya.", date: "Mar 2025", rating: 4 },
  { id: 4, name: "Rahul Nair", location: "Kochi", photo: "", impact: ["₹30,000","3 Classrooms","Education"], short:"Clear reports & verified receipts — process trustworthy.", full:"Monthly progress report, photos, aur UC (utilization certificate) time par milte rahe. Financials neatly mapped the against outcomes. Mujhe laga ki yahan governance strong hai aur kaam measurable outcomes pe focus hai.", date: "Jun 2025", rating: 5 },
  { id: 5, name: "Neha Joshi", location: "Bhopal", photo: "", impact: ["₹10,000","Safe Water","Water"], short:"Small donation, big impact — clear metrics dikhte hain.", full:"Impact dashboard me beneficiary count, delivery dates, aur before/after photos dekh kar bahut achha laga. Process lightweight hai aur digital-first lagta hai — paperwork minimal but compliant.", date: "Feb 2025", rating: 4 },
  { id: 6, name: "Arun Mehta", location: "Mumbai", photo: "", impact: ["₹1,00,000","Community Center","Community"], short:"End-to-end transparency; team responsive rahi.", full:"Proposal se execution tak har phase documented tha. Weekly check-ins hue aur scope change bhi transparent tareeke se communicate kiya gaya. Post-completion, sustainability plan bhi share hua jo kaafi thoughtful tha.", date: "Jan 2025", rating: 5 },
  { id: 7, name: "Priya Singh", location: "Lucknow", photo: "", impact: ["₹8,000","Hygiene Kits","Women"], short:"Responsive helpline & regular updates — seamless experience.", full:"Helpline ne quickly guide kiya ki meri chhoti contribution kahan best use hogi. Monthly SMS/Email updates aati rahi aur ground team ki photos se real progress nazar aayi. Overall, frictionless aur reassuring journey thi.", date: "Aug 2025", rating: 4 },
];

function StarRow({ rating = 5 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          className={i < rating ? "text-[var(--saffron)]" : "text-slate-300"}
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name, photo }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="w-11 h-11 rounded-full object-cover border border-white/60 shadow-sm"
        loading="lazy"
      />
    );
  }
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div className="w-11 h-11 rounded-full bg-white/70 text-slate-700 grid place-items-center text-sm font-semibold border border-white/60 shadow-sm">
      {initials}
    </div>
  );
}

function ClampText({ children, lines = 5 }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <p
        className={`transition-all ${expanded ? "" : `line-clamp-${lines}`}`}
        style={
          !expanded
            ? {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : {}
        }
      >
        {children}
      </p>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-xs font-semibold text-[var(--emerald)] hover:underline"
        aria-expanded={expanded}
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
}

export default function DonorReviews({
  items = DONORS,
  autoPlay = true,
  interval = 5000,
  compact = false,
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef(null);
  const count = items.length;

  // theme from store (selectors)
  const saffron = useThemeStore((s) => s.saffronMid);
  const emerald = useThemeStore((s) => s.emeraldMid);
  const GRAD = useThemeStore((s) => s.GRAD);
  const GRAD_SOFT = useThemeStore((s) => s.GRAD_SOFT);
  const inkColor = useThemeStore((s) => s.ink ?? "#0f172a");

  // animation controls
  const animationEnabled = useThemeStore((s) => s.animationEnabled);
  const animationSpeed = useThemeStore((s) => s.animationSpeed || 1);
  const headingAnimEnabled = useThemeStore((s) => s.headingAnimEnabled);

  const prefersReduced = typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  const shouldAnimate = animationEnabled && !prefersReduced;

  const prev = useCallback(() => setIdx((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIdx((i) => (i + 1) % count), [count]);

  // autoplay
  useEffect(() => {
    if (!autoPlay || paused || reducedMotion || !animationEnabled) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, paused, interval, next, reducedMotion, animationEnabled]);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // reduced motion detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // swipe (mobile)
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
    touchStartX.current = null;
  };

  const active = items[idx];

  // thumbs ordering for rail
  const thumbs = useMemo(() => {
    const order = Array.from({ length: count }, (_, i) => (idx + i) % count);
    const mapped = order.map((i) => items[i]);
    return compact ? mapped.slice(0, 4) : mapped;
  }, [idx, items, count, compact]);

  // animation timing helpers
  const durationScale = animationSpeed || 1;
  const springTransition = shouldAnimate
    ? { type: "spring", stiffness: 200 / durationScale, damping: 22 * durationScale }
    : undefined;

  return (
    <section
      aria-label="Donor Reviews"
      className={`w-full px-4 sm:px-5 md:px-6 ${ compact ? "py-8" : "py-12" }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        ["--saffron"]: saffron ?? "#FF8C1A",
        ["--emerald"]: emerald ?? "#0EA765",
        ["--grad"]: GRAD ?? `linear-gradient(90deg, ${saffron}, ${emerald})`,
        ["--grad-soft"]: GRAD_SOFT ?? `linear-gradient(135deg, ${saffron}22, ${emerald}22)`,
        ["--ink"]: inkColor,
        background: `linear-gradient(180deg, color-mix(in oklab, var(--saffron) 8%, transparent), color-mix(in oklab, var(--emerald) 6%, transparent))`,
      }}
    >
      <div className={`${compact ? "max-w-5xl" : "max-w-7xl"} mx-auto`}>
        {/* Header */}
        <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-3 ${compact ? "mb-4" : "mb-6"}`}>
          <div className="min-w-0 text-center lg:text-left ">
            <h2
              className={`${ compact ? "text-3xl sm:text-4xl" : "text-3xl sm:text-4xl" } font-light tracking-tight bg-clip-text text-transparent`}
            >
              <span
                style={{ display: "inline-block" }}
                className={shouldAnimate && headingAnimEnabled ? "donor-heading-animated" : undefined}
              >
                Donor Reviews
              </span>
            </h2>
            <p className={`text-[var(--ink)] ${compact ? "text-sm" : "text-sm sm:text-base"} mt-6`}>
              Real stories • Verified donors • Measurable impact
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous"
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl border bg-white/70 hover:bg-white active:scale-[0.98] transition"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              ◀
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl border bg-white/70 hover:bg-white active:scale-[0.98] transition"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              ▶
            </button>
          </div>
        </div>

        {/* NEW: layout uses 12-column grid on large screens */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-start`}>
          {/* Left: Spotlight - larger area on lg */}
          <motion.article
            key={active.id}
            initial={shouldAnimate ? { opacity: 0, y: 20 } : {}}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
            transition={springTransition}
            className={`${ compact ? "lg:col-span-8" : "lg:col-span-8" } col-span-1 rounded-2xl md:rounded-3xl border bg-white/80 backdrop-blur-sm ${ compact ? "p-4 sm:p-5" : "p-5 sm:p-6" } relative overflow-hidden shadow-xl`}
            role="region"
            aria-live="polite"
            style={{
              borderColor: "rgba(0,0,0,0.06)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(1200px 400px at -10% -10%, color-mix(in oklab, var(--saffron) 22%, transparent), transparent 40%), radial-gradient(900px 300px at 110% 110%, color-mix(in oklab, var(--emerald) 18%, transparent), transparent 40%)`,
                zIndex: 0,
              }}
            />

            <div className="relative z-10">
              {/* Header row */}
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={active.name} photo={active.photo} />
                  <div className="min-w-0">
                    <div className="font-semibold text-[var(--ink)] flex items-center gap-2">
                      <span className="truncate">{active.name}</span>
                      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-[color-mix(in oklab,var(--emerald) 12%, white)] text-[var(--emerald)] border border-[color-mix(in oklab,var(--emerald) 14%, white)]">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                        </svg>
                        Verified
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {active.location} • {active.date}
                    </div>
                  </div>
                </div>
                <StarRow rating={active.rating} />
              </div>

              {/* Impact chips */}
              <div className="relative mt-3 flex flex-wrap gap-2">
                {active.impact.map((chip) => (
                  <span
                    key={chip}
                    className="px-2.5 py-1 rounded-full text-xs border bg-white/70 text-slate-700"
                    style={{ borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* Big quote */}
              <blockquote className={`relative mt-4 ${ compact ? "text-[16px] sm:text-[18px]" : "text-[18px] sm:text-[20px]" } leading-relaxed text-[var(--ink)]`}>
                <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" className="absolute -left-2 -top-1" fill="var(--saffron)">
                  <path d="M7.17 6A5.001 5.001 0 0 0 2 11v7h7v-7H6.5A3.5 3.5 0 0 1 10 7.5V6H7.17Zm9 0A5.001 5.001 0 0 0 11 11v7h7v-7h-2.5A3.5 3.5 0 0 1 19 7.5V6h-2.83Z" />
                </svg>
                <div className="pl-6">
                  {compact ? <ClampText lines={5}>{active.full}</ClampText> : <p>{active.full}</p>}
                </div>
              </blockquote>

              {!compact && (
                <p className="relative mt-4 text-xs text-slate-500">
                  Swipe / arrows to change review
                </p>
              )}
            </div>
          </motion.article>

          {/* Right: Thumbs column (sticky on large screens) */}
          <aside className={`col-span-1 lg:col-span-4`}>
            <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-7rem)] lg:overflow-auto lg:pr-2">
              {/* Mobile: horizontal rail (unchanged) */}
              <div className="flex md:hidden w-full gap-3 overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:touch] pb-1" style={{ scrollbarWidth: "thin" }}>
                {thumbs.map((d) => (
                  <button
                    key={`m-${d.id}`}
                    onClick={() => setIdx(items.findIndex((x) => x.id === d.id))}
                    aria-label={`Read ${d.name}'s review`}
                    className={`snap-start shrink-0 w-[82%] xs:w-[70%] sm:w-[60%] rounded-2xl border transition overflow-hidden text-left ${ d.id === active.id ? "border-[color-mix(in oklab,var(--emerald)18%,white)] bg-[color-mix(in oklab,var(--emerald)6%,white)]" : "border-slate-200 bg-white hover:bg-slate-50" }`}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <Avatar name={d.name} photo={d.photo} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[var(--ink)] truncate">{d.name}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {d.impact[1]} • {d.location}
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-2">
                          {d.short}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Desktop: vertical rail */}
              <div className="hidden md:flex md:flex-col gap-3 md:overflow-auto">
                {thumbs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setIdx(items.findIndex((x) => x.id === d.id))}
                    aria-label={`Read ${d.name}'s review`}
                    className={`group w-full rounded-2xl border transition overflow-hidden text-left ${ compact ? "md:h-[68px]" : "md:h-[92px]" } ${ d.id === active.id ? "border-[color-mix(in oklab,var(--emerald)18%,white)] bg-[color-mix(in oklab,var(--emerald)6%,white)]" : "border-slate-200 bg-white hover:bg-slate-50" }`}
                    style={{
                      transitionDuration: shouldAnimate ? `${180 * durationScale}ms` : "0ms"
                    }}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <Avatar name={d.name} photo={d.photo} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[var(--ink)] truncate">
                          {d.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {d.impact[1]} • {d.location}
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-1 group-hover:line-clamp-2">
                          {d.short}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Progress bar */}
        {autoPlay && shouldAnimate && (
          <AnimatePresence mode="wait">
            <motion.div key={idx} className={`${ compact ? "mt-4" : "mt-5" } h-1 rounded-full bg-slate-200 overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: paused ? 0 : "100%" }}
                transition={{ duration: paused ? 0 : interval / 1000, ease: "linear" }}
                className="h-full"
                style={{ background: `linear-gradient(90deg, var(--saffron), var(--emerald))` }}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* heading gradient animation styles (respect store + reduced-motion) */}
      <style jsx>{`
        .donor-heading-animated {
          background-image: linear-gradient(90deg, var(--saffron), var(--emerald));
          background-size: 300% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: donorGradMove ${headingAnimEnabled && !prefersReduced ? 6 * animationSpeed : 0}s ease infinite;
        }
        @keyframes donorGradMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-5 { display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}
