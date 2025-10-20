// components/FAQSection.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/stores/themeStore"; // ensure path ok

const RAW_FAQS = [
  { q: "How are donations utilized?", a: "The Donations to Care India Welfare Trust are utilized in different programs like Education, Healthcare, Women's Empowerment, Disaster Relief, and Community Development programs." },
  { q: "How can I contribute to the NGO?", a: "You can help Care India Welfare Trust by contributing through our website, sponsoring a child, volunteering, or participating in corporate social responsibility collaborations." },
  { q: "What is the Care India Welfare Trust Contact Number?", a: "You can reach us via email at info@careindiawelfaretrust.org or call our toll-free number at 18003134006." },
  { q: "How can I volunteer with the NGO?", a: "Yes, Care India Welfare Trust welcomes volunteers for various programs; you can apply through the 'Get Involved' section on our website." },
  { q: "Does Care India Welfare Trust receive government funding?", a: "As an NGO (non-government organization), we do not receive any direct government funding allowing us to stay independent, making unbiased evaluations of government policies and programs. The government has also extended positive tax and duty exemptions to us, enabling us to minimize costs." },
  { q: "What impact has the Care India Welfare Trust made so far?", a: "The Trust has impacted over 95,000 children, treated 1.80 lakh patients, empowered 95,000 women, and given job-oriented courses to 1.25 lakh people." },
];

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export default function FAQSection() {
  const faqs = useMemo(() => RAW_FAQS.map((f, i) => ({ id: `faq-${i + 1}`, ...f })), []);
  const [openId, setOpenId] = useState(faqs[0]?.id ?? null);
  const listRef = useRef(null);

  // theme + animation controls from store
  const saffronMid = useThemeStore((s) => s.saffronMid);
  const emeraldMid = useThemeStore((s) => s.emeraldMid);
  const GRAD = useThemeStore((s) => s.GRAD);
  const GRAD_SOFT = useThemeStore((s) => s.GRAD_SOFT);
  const ink = useThemeStore((s) => s.ink ?? "#0f172a");

  // animation controls
  const animationEnabled = useThemeStore((s) => s.animationEnabled);
  const animationSpeed = useThemeStore((s) => s.animationSpeed || 1);
  const headingAnimEnabled = useThemeStore((s) => s.headingAnimEnabled);

  // respect user 'prefers-reduced-motion' above store
  const prefersReduced = typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
  const shouldAnimate = animationEnabled && !prefersReduced;

  useEffect(() => {
    const h = typeof window !== "undefined" ? window.location.hash?.replace("#", "") : null;
    if (h && faqs.some((f) => f.id === h)) setOpenId(h);
  }, [faqs]);

  const onListKeyDown = (e) => {
    const triggers = listRef.current?.querySelectorAll("[data-faq-trigger]");
    if (!triggers?.length) return;
    const current = Array.from(triggers).findIndex((el) => el === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      triggers[(current + 1 + triggers.length) % triggers.length]?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      triggers[(current - 1 + triggers.length) % triggers.length]?.focus();
    }
  };

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  // motion timings scaled by animationSpeed
  const baseDuration = 0.35 * (1 / (animationSpeed || 1));
  const itemDuration = 0.42 * (1 / (animationSpeed || 1));
  const staggerChildren = 0.06 * (1 / (animationSpeed || 1));

  // variants using store-controlled durations
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: itemDuration, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      className="relative min-h-screen flex items-center py-16 lg:py-24 overflow-hidden"
      style={{
        ["--saffron"]: saffronMid ?? "#FF8C1A",
        ["--emerald"]: emeraldMid ?? "#0EA765",
        ["--grad"]: GRAD ?? `linear-gradient(90deg, var(--saffron), var(--emerald))`,
        ["--grad-soft"]: GRAD_SOFT ?? `linear-gradient(135deg, rgba(255,153,51,0.22), rgba(16,185,129,0.22))`,
        ["--ink"]: ink,
        background: `radial-gradient(1200px 360px at 10% -10%, color-mix(in oklab, var(--saffron) 10%, transparent), transparent 60%), radial-gradient(900px 340px at 95% 110%, color-mix(in oklab, var(--emerald) 10%, transparent), transparent 60%), #fff`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,black,transparent)]" />

      <div className="relative max-w-6xl mx-auto w-full px-6">
        <header className="text-center mb-10 lg:mb-14">
          {/* heading: animated gradient if allowed by store+user */}
          <style>{`
            .faq-heading-animated {
              background-image: linear-gradient(90deg, var(--saffron), var(--emerald));
              background-size: 300% 200%;
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              animation: faq-grad-move ${shouldAnimate && headingAnimEnabled ? 6 / (animationSpeed || 1) : 0}s linear infinite;
            }
            @keyframes faq-grad-move {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }

            @media (prefers-reduced-motion: reduce) {
              .faq-heading-animated { animation: none !important; color: var(--saffron) !important; -webkit-background-clip: unset; background-clip: unset; }
            }
          `}</style>

          <h2
            className={`text-4xl md:text-5xl font-light ${shouldAnimate && headingAnimEnabled ? "faq-heading-animated" : ""}`}
            style={{ backgroundImage: shouldAnimate && headingAnimEnabled ? undefined : `linear-gradient(90deg, var(--saffron), var(--emerald))`, WebkitBackgroundClip: shouldAnimate && headingAnimEnabled ? "text" : "unset", color: !shouldAnimate || !headingAnimEnabled ? "var(--saffron)" : "transparent" }}
          >
            FAQ
          </h2>

          <p className="mt-3 text-sm md:text-base" style={{ color: "var(--ink)" }}>
            Frequently asked questions about Care India Welfare Trust, donations, volunteering, and impact.
          </p>
        </header>

        <motion.ul
          ref={listRef}
          onKeyDown={onListKeyDown}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: shouldAnimate ? staggerChildren : 0 } },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
        >
          {faqs.map(({ id, q, a }, idx) => {
            const isOpen = openId === id;
            return (
              <motion.li key={id} id={id} variants={itemVariants} className="relative">
                <div className="rounded-2xl p-[1px]" style={{ background: `linear-gradient(90deg, color-mix(in oklab, var(--saffron) 40%, transparent), color-mix(in oklab, var(--emerald) 40%, transparent))` }}>
                  <div className="rounded-2xl bg-white/80 backdrop-blur shadow-[0_12px_40px_-16px_rgba(0,0,0,0.25)] transition-shadow hover:shadow-[0_18px_50px_-16px_rgba(14,167,101,0.35)]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${id}-panel`}
                      onClick={() => toggle(id)}
                      data-faq-trigger
                      className="w-full flex items-center justify-between gap-6 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded-2xl"
                      style={{ color: "var(--ink)" }}
                    >
                      <span className="text-base md:text-lg font-semibold flex-1">
                        {q}
                      </span>

                      <span
                        className={`shrink-0 inline-flex items-center justify-center rounded-xl border px-2.5 py-2 transition-all ${isOpen ? "rotate-180 border-green-200 bg-green-50 text-green-600" : "border-gray-200 bg-white text-gray-600"}`}
                        aria-hidden
                        style={{
                          transitionDuration: `${shouldAnimate ? 180 / (animationSpeed || 1) : 0}ms`,
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`${id}-panel`}
                          key="content"
                          initial={{ opacity: 0, height: 0, clipPath: "inset(0 0 100% 0)" }}
                          animate={{ opacity: 1, height: "auto", clipPath: "inset(0 0 0% 0)" }}
                          exit={{ opacity: 0, height: 0, clipPath: "inset(0 0 100% 0)" }}
                          transition={{ duration: shouldAnimate ? baseDuration : 0, ease: [0.22, 1, 0.36, 1] }}
                          className="px-5 pb-5 pt-0"
                          style={{ color: "var(--ink)" }}
                        >
                          <div className="text-sm md:text-base leading-relaxed">
                            {a}
                          </div>

                          <div className="mt-4 h-px w-24 bg-gradient-to-r from-amber-300 to-emerald-400/70 rounded-full" />
                          <div className="sr-only">FAQ #{idx + 1}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      <style jsx>{`
        /* global reduced motion fallback */
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}
