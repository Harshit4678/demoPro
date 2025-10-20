"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

const DEFAULT_SLIDES = [
  { title: "Best Emerging NGO International Excellence Award 2018", image: "/images/bgimg/AwardHero.png", excerpt: "Recognized for community-first approaches and measurable outcomes." },
  { title: "Hunger Free Revolution", image: "/images/bgimg/img2.avif", excerpt: "Daily meals that reach thousands, building a hunger-free tomorrow." },
  { title: "Sashakt Nari — Empowering Women", image: "/images/bgimg/img3.avif", excerpt: "Supporting female entrepreneurs through training and microgrants." },
  { title: "Shiksha Sankalp — Education for All", image: "/images/bgimg/img4.jpg", excerpt: "Helping girls stay in school and build brighter futures." },
  { title: "Nurturing Young Minds", image: "/images/bgimg/img5.avif", excerpt: "Mentorship and scholarships for underprivileged children." },
];

export default function LiveImpactHero({
  slides = DEFAULT_SLIDES,
  videoSrc = "/videos/hero.mp4",
  interval = 4200,
  donateUrl = "/donate",
}) {
  const saffron = useThemeStore ? useThemeStore((s) => s.saffronMid) : "#FF8C1A";
  const emerald = useThemeStore ? useThemeStore((s) => s.emeraldMid) : "#0EA765";
  const brandGradient = `linear-gradient(135deg, ${saffron}cc 0%, ${emerald}cc 100%)`;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(() => nextSlide(), interval);
    return () => clearTimeout(timer.current);
  }, [index, paused, slides.length, interval]);

  const nextSlide = () => setIndex((i) => (i + 1) % slides.length);
  const prevSlide = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  // ensure video starts muted/autoplay friendly
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      // autoplay might be blocked; keep playing state consistent
      setPlaying(false);
    });
  }, []);

  const currentSlide = slides[index];
  const dir = 1;

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        backgroundImage: `url('/images/bgimg/bgImg.jpg'), linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.45)), linear-gradient(135deg, ${saffron}33 0%, ${emerald}33 100%)`,
        backgroundSize: "cover, cover, cover",
        backgroundPosition: "center, center, center",
        backgroundRepeat: "no-repeat, no-repeat, no-repeat",
        backgroundBlendMode: "overlay, normal",
      }}
    >
      <div
        className="absolute inset-0 -z-20"
        style={{
          background: `radial-gradient(800px 300px at 20% 20%, ${saffron}22, transparent), radial-gradient(700px 200px at 80% 80%, ${emerald}22, transparent)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-16 relative z-10 text-white">
        {/* Use grid that collapses to stacked layout on small screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* VIDEO: On mobile it should appear FIRST and be touch-friendly */}
          <div className="lg:col-span-7 order-1 lg:order-1">
            <div
              className="relative rounded-2xl overflow-hidden w-full"
              style={{
                boxShadow: `0 10px 40px ${saffron}22, 0 6px 22px ${emerald}11`,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(6px)",
              }}
            >
              {/* Responsive height: small screens get fixed height, larger screens scale */}
              <div className="w-full h-56 sm:h-72 md:h-80 lg:h-[420px] relative">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  autoPlay
                  loop
                  aria-label="Hero video showcasing impact"
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>

                {/* Controls (bigger tap targets on mobile) */}
                <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                  <button
                    onClick={togglePlay}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition shadow-lg"
                    aria-label={playing ? "Pause video" : "Play video"}
                  >
                    {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition shadow-lg"
                    aria-label={muted ? "Unmute" : "Mute"}
                  >
                    {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CAROUSEL CARD: on mobile it appears AFTER video and becomes full-width card */}
          <div className="lg:col-span-5 order-2 lg:order-2">
            <div className="flex flex-col gap-4  md:mt-10 ">
              {/* Heading */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-[#07122d]">
                  From field to award —{' '}
                  <span 
                   className="font-light"
                    style={{
                      background: `linear-gradient(90deg, ${saffron}, ${emerald})`,
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    stories that matter
                  </span>
                </h1>
              </div>

              {/* Card animation */}
              <AnimatePresence custom={dir} initial={false} mode="wait">
                <motion.div
                  key={index}
                  custom={dir}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className="rounded-2xl overflow-hidden relative"
                  style={{
                    border: '1px solid rgba(0,0,0,0.06)',
                    background: 'rgba(255,255,255,0.98)',
                    boxShadow: `0 12px 30px rgba(7,18,45,0.08)`,
                  }}
                >
                  <div className="w-full h-56 sm:h-64 md:h-72 relative">
                    <img src={currentSlide.image} alt={currentSlide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute left-4 bottom-4 right-4 text-white">
                      <h3 className="text-xl sm:text-2xl leading-tight drop-shadow-lg">{currentSlide.title}</h3>
                      <p className="mt-2 text-sm opacity-90 max-w-full leading-relaxed tracking-wide">{currentSlide.excerpt}</p>
                      <div className="mt-4">
                        <a
                          href={donateUrl}
                          className="inline-block  sm:w-auto px-5 py-3 rounded-full font-semibold text-white shadow-lg hover:scale-80 transition"
                          style={{ background: `linear-gradient(90deg, ${saffron}, ${emerald})` }}
                        >
                          Donate Now
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Pagination + Controls */}
              <div className="flex items-center justify-between mt-2 text-[#07122d]/80">
                <button
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-white/90 hover:bg-white transition shadow"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4 text-[#07122d]" />
                </button>

                <div className="text-sm font-semibold">{index + 1} / {slides.length}</div>

                <button
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-white/90 hover:bg-white transition shadow"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4 text-[#07122d]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
