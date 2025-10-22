"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopCarousel() {
  const images = [
    "/images/bgimg/1.webp",
    "/images/bgimg/2.webp",
    "/images/bgimg/3.webp",
    "/images/bgimg/4.webp",
    "/images/bgimg/5.webp",
  ];

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const pausedRef = useRef(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  // Auto-slide controlled by pause flag
  useEffect(() => {
    const start = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!pausedRef.current) next();
      }, 4000);
    };
    start();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  // Pause/resume helpers
  const handlePointerEnter = () => (pausedRef.current = true);
  const handlePointerLeave = () => (pausedRef.current = false);

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    handlePointerEnter();
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const onTouchEnd = () => {
    const start = touchStartX.current;
    const end = touchEndX.current ?? start;
    const dx = start - end;
    const threshold = 50; // px
    if (dx > threshold) next();
    else if (dx < -threshold) prev();
    touchStartX.current = null;
    touchEndX.current = null;
    handlePointerLeave();
  };

  // keyboard nav (left/right)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className="w-full relative overflow-hidden"
      // Responsive heights: mobile 40vh, md+ 60vh
      style={{ height: "40vh" }}
    >
      <div
        className="relative w-full h-full"
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        // allow keyboard focus for a11y
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Top images carousel"
      >
        <div className="absolute inset-0 md:h-[60vh] h-[40vh]">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index]}
              alt={`slide-${index + 1}`}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-black/40 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-black/40 to-transparent pointer-events-none"></div>

        {/* Left / Right arrows */}
        <button
          aria-label="Previous slide"
          onClick={() => {
            prev();
            handlePointerEnter();
            setTimeout(handlePointerLeave, 600);
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 bg-black/40 rounded-full backdrop-blur-sm hover:bg-black/60 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          aria-label="Next slide"
          onClick={() => {
            next();
            handlePointerEnter();
            setTimeout(handlePointerLeave, 600);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 bg-black/40 rounded-full backdrop-blur-sm hover:bg-black/60 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Mobile small arrows (always visible but minimal) */}
        <button
          aria-hidden
          onClick={prev}
          className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          aria-hidden
          onClick={next}
          className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20 px-4">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                setIndex(i);
                handlePointerEnter();
                setTimeout(handlePointerLeave, 600);
              }}
              className={`rounded-full transition-all duration-200 focus:outline-none ${
                i === index
                  ? "scale-125"
                  : ""
              }`}
            >
              {/* responsive dot sizing: mobile larger for tap */}
              <span
                className={`block ${i === index ? "bg-white" : "bg-white/60"} ${
                  // mobile bigger: w-3 h-3 -> md:w-3 md:h-3, mobile w-4 h-4
                  "w-4 h-4 md:w-3 md:h-3"
                } rounded-full`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Inline responsive style fix (Tailwind can't directly give different vh for small/large in all setups) */}
      <style jsx>{`
        @media (min-width: 768px) {
          section {
            height: 60vh !important;
          }
        }
        @media (max-width: 767px) {
          section {
            height: 40vh !important;
          }
        }
      `}</style>
    </section>
  );
}
