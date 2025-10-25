// src/components/StoriesShowcasePremium.jsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/stores/themeStore";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

/* small helper to convert #rrggbb to "r,g,b" for CSS rgba usage */
function hexToRgb(hex) {
  if (!hex) return "255,153,51";
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return h.split("").map((c) => parseInt(c + c, 16)).join(",");
  }
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

export default function StoriesCarousal({ stories: initialStories = null }) {
  const router = useRouter();
  const { saffronMid, emeraldMid, GRAD, GRAD_SOFT } = useThemeStore();
  const brand = saffronMid || "#FF9933";
  const emerald = emeraldMid || "#10b981";
  const brandRgb = hexToRgb(brand);
  const emeraldRgb = hexToRgb(emerald);

  const [stories, setStories] = useState(initialStories || []);
  const [loading, setLoading] = useState(!initialStories);
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(true);
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const cardsRef = useRef([]);
  const [visibleSet, setVisibleSet] = useState(new Set());

  const activeIndex = useMemo(() => {
    if (!stories || stories.length === 0 || !active) return 0;
    return stories.findIndex((s) => s.id === active);
  }, [active, stories]);

  // fetch stories if not passed as prop
  useEffect(() => {
    if (initialStories) {
      setStories(initialStories);
      setActive(initialStories[0]?.id || null);
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/stories?limit=200`);
        const data = await res.json();
        if (data?.ok && Array.isArray(data.stories)) {
          // map backend shape to what's expected by the component
          const mapped = data.stories.map((it) => ({
            id: it._id || String(Math.random()).slice(2),
            name: it.title || it.name || "Untitled",
            excerpt: it.cardExcerpt || it.excerpt || "",
            image: it.cardImage || it.heroImage || "/images/placeholder-story.jpg",
            slug: it.slug || it._id,
            original: it
          }));
          if (!mounted) return;
          setStories(mapped);
          setActive(mapped[0]?.id || null);
        } else {
          // fallback empty
          if (mounted) setStories([]);
        }
      } catch (err) {
        console.error("Failed to load stories for showcase:", err);
        if (mounted) setStories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [initialStories]);

  // autoplay
  useEffect(() => {
    if (!playing || stories.length === 0) return;
    const id = setInterval(() => {
      setActive((cur) => {
        const idx = stories.findIndex((s) => s.id === cur);
        const next = (idx + 1) % stories.length;
        return stories[next].id;
      });
    }, 4200);
    return () => clearInterval(id);
  }, [playing, stories]);

  const scrollPrev = () => {
    const el = marqueeRef.current;
    if (!el) return;
    el.scrollBy({ left: -280, behavior: "smooth" });
  };
  const scrollNext = () => {
    const el = marqueeRef.current;
    if (!el) return;
    el.scrollBy({ left: 280, behavior: "smooth" });
  };

  const centerCard = (cardEl) => {
    const el = marqueeRef.current;
    if (!el || !cardEl) return;
    const offset = cardEl.offsetLeft - (el.clientWidth / 2) + (cardEl.clientWidth / 2);
    el.scrollTo({ left: offset, behavior: "smooth" });
  };

  const handleCardHover = (sId, e) => {
    setActive(sId);
    const el = marqueeRef.current;
    if (!el) return;
    el.classList.add("paused");
    centerCard(e.currentTarget);
    setPlaying(false);
  };
  const handleCardLeave = () => {
    marqueeRef.current?.classList.remove("paused");
    setPlaying(true);
  };

  // Visible detection (keeps nearby images preloaded)
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    const updateVisible = () => {
      const rect = el.getBoundingClientRect();
      const margin = rect.width * 0.15;
      const visible = new Set();
      cardsRef.current.forEach((cardEl, doubledIdx) => {
        if (!cardEl) return;
        const cRect = cardEl.getBoundingClientRect();
        if (cRect.right >= rect.left - margin && cRect.left <= rect.right + margin) {
          visible.add(doubledIdx % stories.length);
        }
      });
      for (let i = 0; i < Math.min(3, stories.length); i++) visible.add(i);
      setVisibleSet(visible);
    };

    updateVisible();
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        updateVisible();
        raf = null;
      });
    };
    const onResize = () => updateVisible();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(() => updateVisible());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stories.length]);

  const doubled = [...stories, ...stories];

  // placeholder if loading or none
  if (loading) {
    return (
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">Loading stories...</div>
      </section>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">No stories available</div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative w-[100vw] left-1/2 -translate-x-1/2 overflow-x-hidden py-14"
      aria-label="Stories showcase"
      style={{
        ["--brand"]: brand,
        ["--emerald"]: emerald,
        ["--brand-rgb"]: brandRgb,
        ["--emerald-rgb"]: emeraldRgb,
        ["--grad"]: GRAD || `linear-gradient(135deg, ${brand}, ${emerald})`,
        ["--grad-soft"]: GRAD_SOFT || `linear-gradient(135deg, ${brand}33, ${emerald}33)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-2 md:px-12 grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-8 items-start">
        <div className="relative px-4">
          <div className="sticky top-12 lg:top-20">
            <h2 className="text-4xl md:text-5xl font-light leading-tight heading-gradient reveal-up md:pt-8  flex justify-center  ">Stories Of Change</h2>

            <p className="mt-5 text-sm md:text-base text-slate-700 leading-relaxed bg-white/90 p-4 rounded-2xl border shadow-sm reveal-up" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
              At Care India Welfare Trust, the true impact of our efforts shines through in the stories of those whose lives we have changed. These narratives of transformation emphasize the resilience, determination, and hope of individuals and communities that have benefited from our initiatives. From women achieving financial independence to children gaining access to education, and elderly individuals receiving the care and support they need, these inspiring journeys illustrate the strength of collective action and the positive change we are nurturing throughout India.
            </p>

            <button
              onClick={() => alert("Donate clicked")}
              className="mt-6 px-6 py-3 rounded-md text-white font-semibold text-sm shadow-md reveal-up "
              style={{
                background: "var(--grad)",
                boxShadow: `0 10px 30px rgba(var(--brand-rgb), 0.12)`,
              }}
            >
              Donate Now
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl bg-white/98 p-1 md:py-6 shadow-sm border w-[99%] md:w-2xl" style={{ borderColor: `rgba(var(--brand-rgb), 0.08)`, boxShadow: `0 8px 30px rgba(var(--brand-rgb), 0.06)` }}>
            <div className="flex items-center justify-between mb-4 px-4">
              <div className="text-sm font-semibold featured-gradient">Featured Stories</div>
              <div className="flex gap-2">
                <button aria-label="Prev" onClick={scrollPrev} className="h-8 w-8 rounded-full border bg-white" style={{ boxShadow: `0 4px 10px rgba(var(--brand-rgb), 0.06)`, borderColor: `rgba(var(--brand-rgb), 0.08)` }}>‹</button>
                <button aria-label="Next" onClick={scrollNext} className="h-8 w-8 rounded-full border bg-white" style={{ boxShadow: `0 4px 10px rgba(var(--brand-rgb), 0.06)`, borderColor: `rgba(var(--brand-rgb), 0.08)` }}>›</button>
              </div>
            </div>

            <div className="relative">
              <div className="marquee-viewport overflow-hidden">
                <div
                  ref={marqueeRef}
                  className="marquee-track gap-4 py-2 flex items-stretch"
                  onMouseEnter={() => { marqueeRef.current?.classList.add("paused"); setPlaying(false); }}
                  onMouseLeave={() => { marqueeRef.current?.classList.remove("paused"); setPlaying(true); }}
                >
                  {doubled.map((s, idx) => {
                    const originalIndex = idx % stories.length;
                    const isActive = originalIndex === activeIndex;
                    const isVisible = visibleSet.has(originalIndex) || isActive;
                    const stagger = originalIndex;
                    return (
                      <div
                        key={`${s.id}-${idx}`}
                        ref={(el) => { cardsRef.current[idx] = el; }}
                        onMouseEnter={(e) => handleCardHover(s.id, e)}
                        onMouseLeave={handleCardLeave}
                        onClick={() => router.push(`/stories/${s.slug || s.id}`)}
                        className={`card min-w-[220px] max-w-[220px] rounded-xl overflow-visible border bg-white flex-shrink-0 cursor-pointer card-entrance`}
                        role="button"
                        tabIndex={0}
                        style={{
                          borderColor: `rgba(var(--brand-rgb), 0.08)`,
                          transition: "transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms",
                          ["--i"]: `${stagger}`,
                        }}
                      >
                        {/* ring placed BEFORE content and behind via z-index */}
                        <div aria-hidden className="card-ring" />

                        <div className="relative h-40 md:h-56 bg-gray-100 rounded-2xl overflow-hidden" style={{ zIndex: 1 }}>
                          <img
                            src={s.image}
                            alt={s.name}
                            className="rounded-2xl"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            loading={isVisible ? "eager" : "lazy"}
                          />
                          <div className="absolute left-3 bottom-3 bg-white/95 px-2 py-1 rounded-md text-xs font-semibold" style={{ border: "1px solid rgba(0,0,0,0.04)", zIndex: 2 }}>{s.name}</div>
                        </div>

                        <div className="p-3 text-sm text-slate-700" style={{ zIndex: 1 }}>
                          <div className="line-clamp-2 mb-3">{s.excerpt}</div>
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/stories/${s.slug || s.id}`); }}
                            className="px-3 py-1 rounded-md text-xs font-semibold"
                            style={{
                              background: "var(--brand)",
                              color: "#fff",
                              boxShadow: `0 6px 18px rgba(var(--brand-rgb), 0.12)`,
                            }}
                          >
                            Read full story
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">Hover a card to pause and focus • Click card or button to read full story</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --brand: ${brand};
          --emerald: ${emerald};
          --grad: ${GRAD || `linear-gradient(135deg, ${brand}, ${emerald})`};
          --grad-soft: ${GRAD_SOFT || `linear-gradient(135deg, ${brand}33, ${emerald}33)`};
        }

        /* Heading styles */
        .heading-gradient {
          background: linear-gradient(90deg, var(--brand), var(--emerald));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% 200%;
          animation: hueShift 6s linear infinite;
        }
        .featured-gradient { background: linear-gradient(90deg, var(--brand), var(--emerald)); -webkit-background-clip: text; background-clip: text; color: transparent; }

        @keyframes hueShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* reveal-up: subtle entrance for left column */
        .reveal-up {
          opacity: 0;
          transform: translateY(10px);
          animation: revealUp 620ms ease forwards;
          animation-delay: 140ms;
        }
        @keyframes revealUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* marquee viewport clipped so cards never escape parent */
        .marquee-viewport {
          width: 100%;
          overflow: hidden;
          padding-inline: 8px;
          position: relative;
        }

        /* marquee track */
        .marquee-track {
          --speed: 14s;
          display: inline-flex;
          gap: 1rem;
          align-items: stretch;
          will-change: transform;
          white-space: nowrap;
          animation: trackScroll var(--speed) linear infinite;
          padding-inline: 2px;
        }
        .marquee-track.paused { animation-play-state: paused !important; }
        @keyframes trackScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Card entrance: staggered using --i */
        .card-entrance {
          opacity: 0;
          transform: translateY(12px) scale(0.995);
          animation: cardIn 420ms cubic-bezier(.2,.9,.2,1) forwards;
          animation-delay: calc(var(--i) * 90ms + 120ms);
        }
        @keyframes cardIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* base card */
        .card { position: relative; overflow: visible; box-sizing: border-box; z-index: 1; }

        /* ring now behind card content */
        .card-ring {
          pointer-events: none;
          position: absolute;
          inset: -8px;
          border-radius: 14px;
          opacity: 0;
          transition: opacity 220ms ease, transform 220ms ease;
          z-index: 0;
          background: transparent;
          box-shadow: 0 18px 40px rgba(var(--brand-rgb), 0.06), 0 8px 20px rgba(var(--emerald-rgb), 0.04);
          filter: blur(10px);
        }

        /* Apply hover effects only on devices that support hover (desktop) */
        @media (hover: hover) and (pointer: fine) {
          .card:hover { transform: translateY(-6px) scale(1.02); z-index: 30; box-shadow: 0 18px 40px rgba(var(--brand-rgb), 0.12), 0 8px 24px rgba(var(--emerald-rgb), 0.06); transition: transform 220ms, box-shadow 220ms; }
          .card:hover .card-ring {
            opacity: 1;
            transform: scale(1.02);
            background: linear-gradient(90deg, rgba(var(--brand-rgb),0.06), rgba(var(--emerald-rgb),0.06));
          }
        }

        /* For touch devices — disable hover transforms so nothing jumps */
        @media (hover: none), (pointer: coarse) {
          .card { transform: none !important; box-shadow: none !important; }
          .card-ring { display: none !important; }
        }

        /* responsive tweaks */
        @media (max-width: 1024px) {
          .card-entrance { animation-delay: calc(var(--i) * 60ms + 80ms); }
        }

        /* reduced motion safety */
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none !important; }
          .card, .card-entrance, .reveal-up { transition: none !important; animation: none !important; transform: none !important; opacity: 1 !important; }
        }
      `}</style>
    </section>
  );
}
