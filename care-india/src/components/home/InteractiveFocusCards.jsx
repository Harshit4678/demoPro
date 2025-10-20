"use client";
import React, { useState, useMemo } from "react";
import { useThemeStore } from "@/stores/themeStore"; // adjust path if needed

/**
 * Advanced, theme-aware interactive bottom cards
 * - Hover: card height increases so text always fits
 * - Flip method: Curtain Reveal
 * - Idle motion on images
 */

const BOTTOM_CARDS = [
  {
    id: "card1",
    title: "Health",
    image: "/images/bottomcards/health.jpg",
    text:
      "Providing accessible healthcare, medical camps, and wellness awareness for all communities.",
    accent: "#10b981", // emerald
  },
  {
    id: "card2",
    title: "Education",
    image: "/images/bottomcards/education.jpg",
    text:
      "Empowering children and youth through quality education, scholarships, and digital learning tools.",
    accent: "#3b82f6", // blue
  },
  {
    id: "card3",
    title: "Old Age Assistance",
    image: "/images/bottomcards/oldage.jpg",
    text:
      "Supporting elderly citizens with companionship, healthcare, and dignity-focused welfare programs.",
    accent: "#f59e0b", // amber
  },
  {
    id: "card4",
    title: "Women Empowerment",
    image: "/images/bottomcards/women.jpg",
    text:
      "Promoting self-reliance, leadership, and entrepreneurship among women through training and support.",
    accent: "#ec4899", // pink
  },
];

function InteractiveCard({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      tabIndex={0}
      role="button"
      aria-expanded={open}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((s) => !s)}
      className={`relative mx-auto w-[90%] max-w-xl rounded-3xl transition-all duration-500 ease-out focus:outline-none ${
        open ? "h-[32rem]" : "h-[21rem] md:h-[26rem]"
      }`}
      style={{
        ["--accent"]: item.__resolvedAccent,
      }}
    >
      {/* Outer glow */}
      <span
        className="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-60"
        style={{
          background:
            "conic-gradient(from 160deg at 20% 10%, var(--brand), transparent 25%, var(--accent), transparent 60%, var(--brand))",
          filter: open ? "blur(14px)" : "blur(10px)",
          transition: "filter 500ms ease, opacity 500ms ease",
        }}
      />

      {/* Card shell */}
      <div className="relative w-full h-full rounded-3xl bg-white ring-1 ring-black/5 shadow-lg overflow-hidden flex flex-col justify-between">
        {/* FRONT PANEL */}
        <div
          className="relative flex flex-col items-center text-center px-5 pt-6 transition-transform duration-500 ease-out"
          style={{
            transform: open
              ? "translate(-2%, -4%) rotateZ(-2deg) rotateY(-10deg) scale(0.96)"
              : "translate(0,0) rotateZ(0deg) rotateY(0deg) scale(1)",
            transformOrigin: "10% 10%",
            background:
              "linear-gradient(180deg, white 0%, color-mix(in oklab, var(--brand) 4%, white) 100%)",
            zIndex: 2,
          }}
        >
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
            {item.title}
          </h3>
          <div className="relative w-68 h-52 md:w-auto md:h-72 mb-4">
            <div
              className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white"
              style={{
                animation: open
                  ? "floatY 1.6s ease-in-out infinite alternate, sway 2.2s ease-in-out infinite alternate"
                  : "floatY 3.2s ease-in-out infinite alternate, sway 4.2s ease-in-out infinite alternate",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                draggable="false"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="text-sm md:text-base text-slate-600 mb-4">
            Hover / tap to learn more
          </p>
        </div>

        {/* BACK PANEL */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-end text-center transition-[transform,opacity] duration-600 ease-out"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--grad-soft) 70%, white) 0%, color-mix(in oklab, var(--accent) 80%, white) 100%)",
            transform: open
              ? "translateY(0) rotateX(0deg)"
              : "translateY(18%) rotateX(10deg)",
            transformOrigin: "50% 100%",
            opacity: open ? 1 : 0,
            zIndex: 1,
          }}
        >
          <div className="mb-6">
            <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
            <p className="text-sm md:text-base text-slate-800 leading-relaxed max-w-prose mx-auto">
              {item.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InteractiveBottomCards() {
  // read theme values from store
  const {
    saffronMid,
    emeraldMid,
    grad,
    gradSoft,
    ink,
    accentDefaults,
  } = useThemeStore();

  // resolve accents for each bottom card (fallback order: item.accent -> accentDefaults by id/title -> accentDefaults.default -> saffronMid)
  const resolvedCards = useMemo(() => {
    return BOTTOM_CARDS.map((c) => {
      const fallbackByKey =
        (accentDefaults && (accentDefaults[c.id] || accentDefaults[c.title?.toLowerCase()])) ||
        (accentDefaults && accentDefaults.default);
      const resolved =
        c.accent ?? fallbackByKey ?? (accentDefaults && accentDefaults.default) ?? saffronMid ?? "#FF9933";
      return { ...c, __resolvedAccent: resolved };
    });
  }, [saffronMid, accentDefaults]);

  return (
    <div
      className="mt-12 px-4 md:px-8 lg:px-10"
      style={{
        ["--brand"]: saffronMid ?? "#FF9933", // saffron brand from store
        ["--emerald"]: emeraldMid ?? "#10b981",
        ["--grad"]: grad ?? "#ffbf66",
        ["--grad-soft"]: gradSoft ?? "#fff1e0",
        ["--ink"]: ink ?? "#0f172a",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {resolvedCards.map((c) => (
          <InteractiveCard key={c.id} item={c} />
        ))}
      </div>

      <style jsx global>{`
        @keyframes floatY {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
        @keyframes sway {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(-1.5deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
