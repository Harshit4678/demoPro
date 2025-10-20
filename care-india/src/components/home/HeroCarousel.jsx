// components/HeroCarousel.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useThemeStore } from "@/stores/themeStore";

const SLIDES = [
  { src: "/images/corousalimg/img1.avif", title: "Best Emerging Ngo International Excellance award 2018" },
  { src: "/images/corousalimg/img2.avif", title: "Hunger Free Revolution" },
  { src: "/images/corousalimg/img3.avif", title: "Sashakt Nari Empowering Women " },
  { src: "/images/corousalimg/img4.jpg", title: "Shiksha Sankalp Women education and development" },
  { src: "/images/corousalimg/img5.avif", title: "Girl child education norturing young minds" },
];

// Clone-first-last for seamless loop
const CLONED = [SLIDES[SLIDES.length - 1], ...SLIDES, SLIDES[0]];

export default function HeroCarousel() {
  // get brand colors from store
  const saffron = useThemeStore((s) => s.saffronMid);
  const GRAD = useThemeStore((s) => s.GRAD);
  // optional: const GRAD_SOFT = useThemeStore(s => s.GRAD_SOFT);

  // Logical index starts at 1 (because 0 is last-clone)
  const [index, setIndex] = useState(1);
  const [hover, setHover] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const timerRef = useRef(null);
  const trackRef = useRef(null);

  // Autoplay
  useEffect(() => {
    if (hover) return;
    timerRef.current = setInterval(() => {
      next();
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [hover, index]); // re-arm to keep rhythm

  const next = () => {
    setIsAnimating(true);
    setIndex((i) => i + 1);
  };

  const prev = () => {
    setIsAnimating(true);
    setIndex((i) => i - 1);
  };

  // After transition ends, if we’re at clones, jump without animation
  const onTransitionEnd = () => {
    // at first fake (0) -> jump to real last (SLIDES.length)
    if (index === 0) {
      setIsAnimating(false);
      setIndex(SLIDES.length);
    }
    // at last fake (SLIDES.length+1) -> jump to real first (1)
    if (index === SLIDES.length + 1) {
      setIsAnimating(false);
      setIndex(1);
    }
  };

  // Apply no-animation jump immediately when isAnimating false flips
  useEffect(() => {
    if (!isAnimating) {
      // tiny timeout to allow DOM style flip
      const id = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isAnimating]);

  // Translate percentage based on current index in CLONED
  const translate = `translateX(-${index * 100}%)`;

  // Dots: show SLIDES.length dots for real slides; map active logically
  const activeDot = ((index - 1 + SLIDES.length) % SLIDES.length);

  const goTo = (dotIdx) => {
    // dotIdx is 0..SLIDES.length-1 -> real index = dotIdx+1
    setIsAnimating(true);
    setIndex(dotIdx + 1);
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      aria-label="Hero carousel"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Slides track */}
      <div
        ref={trackRef}
        className="h-full w-full flex"
        style={{
          transform: translate,
          transition: isAnimating ? "transform 700ms ease-out" : "none",
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {CLONED.map((s, i) => (
          <div key={i} className="relative min-w-full h-full">
            <img
              src={s.src}
              alt={s.title}
              className="absolute inset-0 h-full w-full object-cover"
              draggable="false"
            />
            <div className="absolute inset-0 bg-black/40" />
            {/* Overlay content (left aligned) */}
            <div className="relative z-10 h-full flex items-center">
              <div className="px-6 sm:px-10 max-w-2xl">
                <h1 className="text-white drop-shadow-md text-3xl sm:text-5xl font-extrabold leading-tight">
                  {s.title}
                </h1>
                <div className="mt-5">
                  <Link
                    href="/donate"
                    className="inline-block rounded-full px-6 py-3 font-semibold"
                    style={{
                      background: "white",
                      color: saffron,
                      border: `2px solid ${saffron}`,
                    }}
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow"
        style={{ color: saffron, border: `1px solid ${saffron}33` }}
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow"
        style={{ color: saffron, border: `1px solid ${saffron}33` }}
      >
        ›
      </button>

      {/* Dots (center bottom) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((_, i) => {
          const active = i === activeDot;
          return (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className="h-3 w-3 rounded-full transition-all"
              style={{
                background: active ? saffron : "white",
                border: `2px solid ${saffron}`,
                transform: active ? "scale(1.1)" : "scale(1)",
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        /* optional: make donate button use gradient if desired */
        .donate-gradient {
          background: ${GRAD};
          color: #fff;
          border: 2px solid ${saffron};
        }
        .donate-gradient:hover {
          filter: brightness(1.02);
          box-shadow: 0 8px 26px ${saffron}33;
        }
      `}</style>
    </section>
  );
}
