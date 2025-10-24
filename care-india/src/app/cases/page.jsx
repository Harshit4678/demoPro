"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useThemeStore } from "@/stores/themeStore";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
  hover: { y: -8, scale: 1.02, transition: { duration: 0.25 } },
};

export default function CasesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { saffronMid, emeraldMid, GRAD, GRAD_SOFT } = useThemeStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cases`);
        const data = await res.json();
        if (data?.ok) setItems(data.items || []);
      } catch (err) {
        console.error("Failed to load cases:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // styles derived from theme
  const accentGradient = `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`;
  const borderGlow = `${emeraldMid}33`; // used in shadows
  const subtleBg = GRAD_SOFT || "linear-gradient(90deg,#f8fafc,#fff7ed)";

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative">
        <div className="w-full h-64 md:h-[380px] lg:h-[460px] overflow-hidden">
          <img src="/images/casesHero.jpg" alt="Cases Hero" className="w-full h-full object-cover" />
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: GRAD_SOFT || "linear-gradient(180deg, rgba(255,255,255,0), rgba(0,0,0,0.06))", mixBlendMode: "overlay", opacity: 0.12 }} />
        </div>

        {/* Breadcrumb strip (box-shadow, no border) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 mt-4 rounded-xl" style={{ boxShadow: `0 10px 30px ${borderGlow}, 0 6px 18px ${saffronMid}22`, background: "white" }}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Home &gt; Achievements &gt; <span className="font-medium text-gray-800">Cases</span></div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">Cases</div>
          </div>
        </div>

        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center py-8 px-4">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3" style={{ background: GRAD || accentGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Current Initiatives of Care India Welfare Trust
          </h1>
          <p className="text-gray-700 text-base md:text-lg">Explore the ongoing cases — click any card to read the full story.</p>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No cases found</div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((it, idx) => {
              const slug = encodeURIComponent(decodeURIComponent(it.slug || it._id || ""));
              return (
                <motion.article
                  key={it._id || idx}
                  variants={cardVariants}
                  whileHover="hover"
                  className="rounded-2xl overflow-hidden bg-white"
                  style={{
                    boxShadow: `0 20px 50px rgba(2,6,23,0.08), 0 6px 18px ${borderGlow}`,
                    borderRadius: 18,
                    border: `1px solid rgba(15,23,42,0.03)`,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 380, // taller, card rectangle
                  }}
                >
                  <Link href={`/cases/${slug}`} className="group block flex-1 flex flex-col" aria-label={`Read story: ${it.title}`}>
                    {/* IMAGE: full-width on top */}
                    <div className="w-full h-48 md:h-56 lg:h-64 bg-gray-100 overflow-hidden relative" style={{ borderBottom: `4px solid rgba(0,0,0,0.02)` }}>
                      {it.cardImage ? (
                        <img
                          src={it.cardImage}
                          alt={it.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ display: "block" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No image</div>
                      )}

                      {/* small accent top-right chip */}
                      <div className="absolute top-3 right-3">
                        <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.8)", boxShadow: `0 6px 18px ${emeraldMid}22`, color: "#0f172a" }}>
                          Case
                        </span>
                      </div>

                      {/* bottom color stripe to hint border color */}
                      <div className="absolute left-0 right-0 bottom-0 h-1" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})` }} />
                    </div>

                    {/* BODY */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-2" style={{ color: "#0f172a" }}>{it.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-4">{it.cardExcerpt || "—"}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-xs text-gray-500">{it.publishedAt ? new Date(it.publishedAt).toLocaleDateString() : ""}</div>

                        {/* READ STORY button bottom-right */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium px-3 py-1 rounded-lg" style={{ background: subtleBg, color: "#06202a", boxShadow: "0 6px 18px rgba(2,6,23,0.04)" }}>
                            Details
                          </span>
                          <button
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium shadow-md"
                            style={{
                              background: `linear-gradient(90deg, ${emeraldMid}, ${saffronMid})`,
                              boxShadow: `0 10px 30px ${emeraldMid}22`,
                            }}
                            aria-label={`Read full story: ${it.title}`}
                          >
                            Read story
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                              <path d="M5 12h14" stroke="rgba(255,255,255,0.95)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M12 5l7 7-7 7" stroke="rgba(255,255,255,0.95)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </section>
    </main>
  );
}
