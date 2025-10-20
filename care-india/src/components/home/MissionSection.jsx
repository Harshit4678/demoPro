// components/MissionSection.jsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import { useThemeStore } from "@/stores/themeStore";

/** DATA (same) */
const CARDS = [
  {
    id: "education",
    title: "Education",
    desc: "Quality schooling, scholarships, learning materials and teacher training to build future-ready children.",
    logo: "/images/cardlogos/education.png",
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    desc: "Primary health camps, immunisation drives and maternal & child health initiatives across communities.",
    logo: "/images/cardlogos/healthcare.png",
    quote: "The good physician treats the disease; the great physician treats the patient who has the disease.",
    author: "William Osler",
  },
  {
    id: "livelihood",
    title: "Livelihood",
    desc: "Skill training, micro-enterprise support and livelihood programmes to ensure financial dignity.",
    logo: "/images/cardlogos/livelihood.png",
    quote: "Give a man a fish and you feed him for a day. Teach him how to fish and you feed him for a lifetime.",
    author: "Lao Tzu",
  },
];

/** Magnetic tilt - allow both mouse + touch, reduce intensity on small viewports */
function useMagnetic(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      // unify event shape for mouse and touch
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY);
      if (clientX == null || clientY == null) return;

      const r = el.getBoundingClientRect();
      const x = (clientX - (r.left + r.width / 2)) / (r.width / 2);
      const y = (clientY - (r.top + r.height / 2)) / (r.height / 2);

      // reduce intensity on small screens
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const factor = vw < 480 ? 0.5 : 1;

      const rot = 8 * factor;
      const tx = 8 * factor;

      el.style.setProperty("--rx", `${(-y * rot).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * rot).toFixed(2)}deg`);
      el.style.setProperty("--tx", `${(x * tx).toFixed(2)}px`);
      el.style.setProperty("--ty", `${(-y * tx).toFixed(2)}px`);
    };

    const reset = () => {
      el.style.setProperty("--rx", `0deg`);
      el.style.setProperty("--ry", `0deg`);
      el.style.setProperty("--tx", `0px`);
      el.style.setProperty("--ty", `0px`);
    };

    const touchMove = (ev) => onMove(ev);

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    el.addEventListener("touchmove", touchMove, { passive: true });
    el.addEventListener("touchend", reset);
    el.addEventListener("touchcancel", reset);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
      el.removeEventListener("touchmove", touchMove);
      el.removeEventListener("touchend", reset);
      el.removeEventListener("touchcancel", reset);
    };
  }, [ref]);
}

function FuturisticFlipCard({ item }) {
  const shell = useRef(null);
  useMagnetic(shell);
  const [flipped, setFlipped] = useState(false);
  const [bounce, setBounce] = useState(false);

  const saffron = useThemeStore((s) => s.saffronMid);
  const emerald = useThemeStore((s) => s.emeraldMid);
  const GRAD = useThemeStore((s) => s.GRAD);

  const triggerBounce = () => {
    setBounce(true);
    setTimeout(() => setBounce(false), 650);
  };

  // Detect touch for UX differences (hints/explicit buttons)
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const touch = typeof window !== "undefined" && (("ontouchstart" in window) || navigator.maxTouchPoints > 0);
    setIsTouch(!!touch);
  }, []);

  return (
    <div
      className="group relative"
      style={{ transform: `translate3d(var(--tx,0),var(--ty,0),0)` }}
    >
      {/* ambient glows */}
      <span
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-30 blur-xl transition duration-500 group-hover:opacity-60"
        style={{
          background: `conic-gradient(at 20% 20%, ${saffron}, transparent 25%, ${emerald}, transparent 60%, ${saffron})`,
        }}
      />
      <span
        className="pointer-events-none absolute -inset-8 rounded-[28px] opacity-50 blur-2xl"
        style={{
          background: `radial-gradient(120px 80px at 20% 0%, ${saffron}22, transparent), radial-gradient(140px 120px at 95% 60%, ${emerald}22, transparent)`,
        }}
      />

      <div
        ref={shell}
        className={`relative h-64 w-[min(88vw,340px)] rounded-2xl transition-transform duration-500 ${bounce ? "animate-[cardBounce_650ms_ease]" : ""}`}
        style={{ transform: `rotateX(var(--rx,0)) rotateY(var(--ry,0))` }}
      >
        <div
          // clickable area toggles flip on tap/click; hover still rotates on non-touch
          className={`relative h-full w-full rounded-2xl [transform-style:preserve-3d] transition-transform duration-700 ${flipped ? "[transform:rotateY(180deg)]" : "hover:[transform:rotateY(180deg)]"}`}
          onClick={() => {
            setFlipped((s) => !s);
            triggerBounce();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((s) => !s);
              triggerBounce();
            }
          }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg overflow-hidden [backface-visibility:hidden]">
            <div className="flex h-full items-stretch gap-4 p-4">
              <div className="relative flex w-24 sm:w-28 items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-sm border border-white/60 shadow-sm" />
                <img
                  src={item.logo}
                  alt={`${item.title} logo`}
                  className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm"
                  draggable="false"
                />
                <span
                  className="absolute left-2 top-2 h-2 w-2 rounded-full animate-ping"
                  style={{ background: saffron, animationDuration: "2.2s" }}
                />
                <span
                  className="absolute right-2 bottom-2 h-1.5 w-1.5 rounded-full animate-[pulse_2.4s_ease-in-out_infinite]"
                  style={{ background: emerald }}
                />
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm sm:text-[0.95rem] leading-relaxed text-gray-700">{item.desc}</p>

                <div className="mt-auto flex items-center gap-2">
                  <button
                    className="relative inline-flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow transition active:scale-[.98]"
                    style={{ background: GRAD }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Explore
                  </button>

                  {!isTouch ? (
                    <span className="text-xs text-gray-500">Hover or tap to flip</span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(true);
                        triggerBounce();
                      }}
                      className="text-xs text-gray-600 underline"
                    >
                      Learn more
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-2xl backdrop-blur-md shadow-xl overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden] grid place-items-center"
            style={{ background: `linear-gradient(135deg, ${saffron}20, #fff 40%, ${emerald}20)` }}
          >
            <div className="px-6 text-center">
              <blockquote className="text-sm md:text-base italic text-gray-800">“{item.quote}”</blockquote>
              <div className="mt-2 text-xs font-semibold text-gray-700">— {item.author}</div>

              <div className="mt-4">
                {/* Close button on back for touch users */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFlipped(false);
                  }}
                  className="mt-2 inline-flex items-center px-4 py-2 rounded-full bg-white text-sm font-semibold shadow"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        <span className="pointer-events-none absolute -top-2 -left-2 h-6 w-6 rounded-full blur-md opacity-50 group-hover:opacity-80 transition" style={{ background: saffron }} />
        <span className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 rounded-full blur-md opacity-50 group-hover:opacity-80 transition" style={{ background: emerald }} />
      </div>
    </div>
  );
}

function FlipCardGrid() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {CARDS.map((c) => (
          <FuturisticFlipCard key={c.id} item={c} />
        ))}
      </div>
    </div>
  );
}

export default function MissionSection() {
  const saffron = useThemeStore((s) => s.saffronMid);
  const emerald = useThemeStore((s) => s.emeraldMid);
  const GRAD = useThemeStore((s) => s.GRAD);

  const cssVars = {
    "--saffron": saffron,
    "--emerald": emerald,
    "--grad": GRAD,
  };

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden" style={cssVars}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 40% at 20% 0%, ${saffron}22, transparent), radial-gradient(60% 40% at 90% 80%, ${emerald}22, transparent)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            background: "repeating-linear-gradient(90deg,transparent 0,transparent 38px,rgba(0,0,0,.04) 38px,rgba(0,0,0,.04) 39px)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight relative inline-block px-2">
            <span
              className="relative inline-block mission-gradient animate-shine"
              style={{ backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Our Mission
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed animate-[revealUp_700ms_200ms_ease-out_forwards]">
            At Care India Welfare Trust, we focus on three key areas to drive sustainable change and uplift vulnerable communities across India. Our women empowerment programs help women gain financial independence, access education, and assert their rights. Through our child education initiatives, we ensure underprivileged children have access to quality education, unlocking opportunities for their future. Additionally, our elderly care and support programs provide seniors with essential healthcare, nutrition, and companionship, ensuring they live with dignity.
          </p>
        </div>

        <div className="mt-10">
          <FlipCardGrid />
        </div>

        <div className="mx-auto mt-12 h-[2px] w-11/12 sm:w-2/3 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${saffron}, ${emerald})` }} />
      </div>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .group * { animation: none !important; transition: none !important; }
        }
        .animate-shine { animation: shine 2.8s ease-in-out infinite; background-size: 200% 100%; }
        .mission-gradient { background-size: 200% 100%; background-position: 0% 50%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; position: relative; padding-bottom: 0.05rem; }
        .mission-gradient::after { content: ''; position: absolute; left: 0; bottom: -8px; height: 3px; width: 0%; border-radius: 999px; background-image: var(--grad); transition: width 650ms cubic-bezier(.2,.9,.2,1), opacity 400ms; opacity: 0.95; will-change: width; }
        .mission-gradient.reveal::after { width: 100%; }

        @keyframes shine { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes underlineReveal { 0% { width: 0%; opacity: 0.2; } 100% { width: 100%; opacity: 1; } }
        @keyframes revealUp { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes cardBounce {
          0% { transform: translateY(0) scale(1); }
          35% { transform: translateY(-8px) scale(1.03); }
          70% { transform: translateY(0) scale(1); }
          85% { transform: translateY(-3px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }

        /* Adjust 3D intensity on touch / small screens but KEEP animations */
        @media (hover: none), (max-width: 640px) {
          /* reduce bounce intensity */
          @keyframes cardBounce {
            0% { transform: translateY(0) scale(1); }
            35% { transform: translateY(-5px) scale(1.015); }
            70% { transform: translateY(0) scale(1); }
            85% { transform: translateY(-2px) scale(1.005); }
            100% { transform: translateY(0) scale(1); }
          }

          /* Make cards slightly smaller and improve tap targets */
          .h-64 { height: 16rem !important; } /* ensures consistent small size */
          .w-\[min\(88vw\,340px\)\] { width: min(88vw,340px) !important; }

          /* Keep backface visible rules but reduced rotation intensity already handled in JS (useMagnetic) */
          .group [backface-visibility\\:hidden] { backface-visibility: hidden !important; }
        }

        @keyframes cardBounceSmall { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(-4px) scale(1.01); } 100% { transform: translateY(0) scale(1); } }
      `}</style>
    </section>
  );
}
