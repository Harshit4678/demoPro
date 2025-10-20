// components/GallerySection.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useThemeStore } from "@/stores/themeStore";

/**
 * GallerySection — theme + animation controlled via useThemeStore()
 *
 * - Animated branded heading (theme-driven gradient)
 * - Card reveals (IntersectionObserver) with theme-controlled durations
 * - Modal uses a React portal so it always appears above everything
 */

function ModalPortal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function GallerySection() {
  // theme from store (single source)
  const {
    saffronMid,
    emeraldMid,
    grad: GRAD,
    gradSoft: GRAD_SOFT,
    ink,
    ANIM_ENABLED,
    ANIM_SPEED,
    HEADING_SHINE_DURATION,
    REVEAL_DURATION,
  } = useThemeStore();

  const saffron = saffronMid ?? "#FF8C1A";
  const green = emeraldMid ?? "#0EA765";
  const grad = GRAD ?? `linear-gradient(135deg, ${saffron} 0%, ${saffron}33 40%, ${green} 100%)`;
  const gradSoft = GRAD_SOFT ?? `linear-gradient(135deg, ${saffron}22 0%, ${green}11 100%)`;
  const inkColor = ink ?? "#0f172a";

  // animation defaults (can be overridden from store)
  const animEnabled = typeof ANIM_ENABLED === "boolean" ? ANIM_ENABLED : true;
  const animSpeed = typeof ANIM_SPEED === "number" ? Math.max(0.25, ANIM_SPEED) : 1; // multiplier
  const shineDur = typeof HEADING_SHINE_DURATION === "number" ? `${HEADING_SHINE_DURATION}s` : `${3.2 * (1 / animSpeed)}s`;
  const revealDur = typeof REVEAL_DURATION === "number" ? REVEAL_DURATION : Math.round(520 * (1 / animSpeed)); // ms

  // 3D tilt handlers for cards
  const onCardMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    e.currentTarget.style.setProperty("--rx", `${-y}deg`);
    e.currentTarget.style.setProperty("--ry", `${x}deg`);
    e.currentTarget.style.setProperty("--tx", `${x * 1.2}px`);
    e.currentTarget.style.setProperty("--ty", `${y * 1.2}px`);
  };
  const onCardLeave = (e) => {
    e.currentTarget.style.setProperty("--rx", `0deg`);
    e.currentTarget.style.setProperty("--ry", `0deg`);
    e.currentTarget.style.setProperty("--tx", `0px`);
    e.currentTarget.style.setProperty("--ty", `0px`);
  };

  const images = useMemo(
    () => [
      { src: "/images/gallaryImages/img1.webp", alt: "Community event — Care India" },
      { src: "/images/gallaryImages/img2.webp", alt: "Education program — Care India" },
      { src: "/images/gallaryImages/img3.webp", alt: "Women empowerment — Care India" },
      { src: "/images/gallaryImages/img4.webp", alt: "Elderly care service — Care India" },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const sectionRef = useRef(null);

  // Intersection reveal (uses CSS variable --reveal-duration)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  const openAt = (i) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center py-16 lg:py-20 overflow-hidden"
      style={{
        // expose theme as CSS variables for children and animation config
        ["--saffron"]: saffron,
        ["--green"]: green,
        ["--grad"]: grad,
        ["--grad-soft"]: gradSoft,
        ["--ink"]: inkColor,
        ["--anim-on"]: animEnabled ? 1 : 0,
        ["--anim-speed"]: animSpeed,
        ["--shine-duration"]: shineDur,
        ["--reveal-duration"]: `${revealDur}ms`,
        background: `linear-gradient(135deg, color-mix(in oklab, var(--saffron) 8%, transparent), color-mix(in oklab, var(--green) 8%, transparent)), radial-gradient(1000px 340px at 10% -10%, color-mix(in oklab, var(--saffron) 10%, transparent), transparent 60%), radial-gradient(900px 360px at 95% 110%, color-mix(in oklab, var(--green) 10%, transparent), transparent 60%), #fff`,
      }}
    >
      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <header className="max-w-4xl mx-auto text-center mb-10 lg:mb-14" data-reveal>
          <h2
            className="font-light tracking-tight text-4xl md:text-5xl bg-clip-text text-transparent relative inline-block"
            style={{
              backgroundImage: `linear-gradient(90deg, var(--saffron), var(--green), var(--saffron), var(--green))`,
              backgroundSize: "300% 300%",
              animation: animEnabled ? `moveGradient var(--shine-duration) linear infinite` : "none",
            }}
          >
            Our Gallery
          </h2>

          <p
            className="mt-4 text-base md:text-lg text-gray-700 leading-relaxed"
            style={{
              transition: `opacity var(--reveal-duration) ease, transform var(--reveal-duration) cubic-bezier(.22,1,.36,1)`,
            }}
          >
            Our Gallery highlights the impactful moments and inspiring stories of transformation that characterize our efforts at Care India Welfare Trust. From community events and educational programs to initiatives for women's empowerment and services for the elderly, each image narrates a story of hope, resilience, and progress.
          </p>
        </header>

        <div className="[&_.card]:mb-5 columns-1 sm:columns-2 lg:columns-3 gap-6" data-reveal>
          {images.map((img, i) => (
            <article
              key={i}
              data-reveal
              className="card group relative overflow-hidden rounded-3xl border border-white/30 backdrop-blur-sm bg-white/80 break-inside-avoid cursor-pointer will-change-transform transition-all"
              onMouseMove={onCardMove}
              onMouseLeave={onCardLeave}
              onClick={() => openAt(i)}
              title={img.alt}
              style={{
                transform: `rotateX(var(--rx)) rotateY(var(--ry)) translate(var(--tx), var(--ty))`,
                transition: `transform 360ms cubic-bezier(.22,1,.36,1), box-shadow 360ms`,
                boxShadow: `0 12px 30px -10px rgba(0,0,0,0.08)`,
              }}
            >
              <div className="relative">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-auto block object-cover rounded-3xl transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(180deg, rgba(0,0,0,.28), rgba(0,0,0,.05) 45%, transparent), radial-gradient(400px 200px at 50% 80%, color-mix(in oklab,var(--saffron) 18%, transparent), color-mix(in oklab,var(--green) 14%, transparent))`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span
                    className="px-4 py-1 text-xs font-semibold rounded-full text-white shadow-lg"
                    style={{ backgroundImage: `linear-gradient(90deg, var(--saffron), var(--green))` }}
                  >
                    View
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {open && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[80vh] flex items-center justify-center"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-5 right-5 text-white text-3xl font-light hover:text-amber-400 transition z-50"
              >
                ✕
              </button>

              <button
                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                aria-label="Previous"
                className="absolute left-4 md:left-10 text-white text-4xl font-light hover:text-amber-400 transition z-50"
              >
                ←
              </button>

              <figure className="w-full flex items-center justify-center">
                <img
                  src={images[index].src}
                  alt={images[index].alt}
                  className="w-auto max-w-full h-auto max-h-[80vh] rounded-2xl transition-transform duration-700"
                  style={{
                    boxShadow: `0 0 40px -10px color-mix(in oklab, var(--saffron) 60%, transparent)`,
                  }}
                />
              </figure>

              <button
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                aria-label="Next"
                className="absolute right-4 md:right-10 text-white text-4xl font-light hover:text-green-400 transition z-50"
              >
                →
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      <style jsx>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity var(--reveal-duration) ease, transform var(--reveal-duration) cubic-bezier(.22,1,.36,1);
        }
        [data-reveal].show {
          opacity: 1;
          transform: translateY(0);
        }

        /* heading moveGradient animation controlled via --shine-duration */
        @keyframes moveGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* light fade-in for modal */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 260ms ease;
        }

        /* small helpers */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
