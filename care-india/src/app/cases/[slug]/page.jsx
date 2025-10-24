"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useThemeStore } from "@/stores/themeStore";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 1) => ({ opacity: 1, y: 0, transition: { duration: 0.5 * i, ease: "easeOut" } }),
};

export default function CaseDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const { saffronMid, emeraldMid, GRAD, GRAD_SOFT } = useThemeStore();

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cases/${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data?.ok) setItem(data.case || null);
      } catch (err) {
        console.error("detail fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!item) return <div className="p-8 text-center">Case not found</div>;

  const blocks = Array.isArray(item.contentBlocks) ? [...item.contentBlocks] : [];

  const headingGradientFor = (idx) => {
    return idx % 2 === 0 ? GRAD_SOFT || GRAD : GRAD || GRAD_SOFT;
  };

  return (
    <main className="min-h-screen bg-white pb-16">
      {/* HERO */}
      <section aria-label="hero-section" className="w-full">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="w-full overflow-hidden rounded-b-2xl shadow-2xl" style={{ boxShadow: `0 30px 60px rgba(16,24,40,0.12)` }}>
            <div className="w-full flex justify-center bg-black/2">
              <img
                src={item.heroImage || item.cardImage || "/images/casesHero.jpg"}
                alt={item.title}
                className="w-full h-auto max-h-[60vh] md:max-h-[520px] object-contain mx-auto transform-gpu transition-transform duration-700 rounded-b-2xl"
                style={{ filter: 'contrast(1.02) saturate(1.05)', objectPosition: 'center top' }}
              />
            </div>
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: GRAD_SOFT, mixBlendMode: 'overlay', opacity: 0.12 }} />
          </div>
        </div>
      </section>

      {/* BREADCRUMB STRIP */}
      <section aria-label="breadcrumb-strip" className="w-full mt-6">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 py-4"
          style={{
            background: 'white',
            boxShadow: `0 8px 24px ${saffronMid}22, 0 4px 12px ${emeraldMid}11`,
            borderRadius: '0 0 16px 16px',
          }}
        >
          <div className="text-sm text-gray-600 truncate">Home &gt; Cases &gt; <span className="font-medium text-gray-800">{item.title}</span></div>

          <h2
            className="text-base sm:text-lg md:text-2xl font-light leading-snug mt-2 text-left sm:text-left"
            style={{
              background: headingGradientFor(0),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `0 6px 18px ${emeraldMid}22`,
            }}
          >
            {item.cardExcerpt || `Read ${item.title} Story: Her Fight For the Better Future`}
          </h2>
        </div>
      </section>

      {/* CONTENT */}
      <section aria-label="content-section" className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-white rounded-lg pb-8 relative" style={{ boxShadow: '0 18px 40px rgba(2,6,23,0.08)' }}>
          <div className="px-4 sm:px-8 pt-10">
            {/* HEADER: stacked on mobile, two-column on md+ */}
            <motion.header initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="w-full text-center">
              <div className="md:flex md:items-center md:gap-8 justify-center">
                {/* LEFT (image) — centered on mobile, left on md+ */}
                <div className="w-full md:w-1/3 flex justify-center md:justify-start mb-4 md:mb-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="rounded-xl overflow-hidden bg-white border border-gray-100 md:10"
                    style={{
                      boxShadow: `0 18px 48px rgba(2,6,23,0.08), 0 10px 30px rgba(16,24,40,0.06)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      maxWidth: 280,
                      padding: 0,
                    }}
                  >
                    <img
                      src={item.cardImage || item.heroImage || '/images/caseThumb.jpg'}
                      alt={`${item.title} thumbnail`}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                      style={{ maxHeight: 360, borderRadius: 10, filter: 'contrast(1.03) saturate(1.06)' }}
                    />
                  </motion.div>
                </div>

                {/* RIGHT (text) */}
                <div className="w-full md:flex-1 mt-0 text-center md:text-left">
                  <motion.h1 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }} className="text-2xl sm:text-3xl md:text-4xl font-light leading-tight tracking-tight mb-2 text-center md:text-left" style={{ background: headingGradientFor(1), WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: `0 6px 18px ${emeraldMid}22` }}>
                    {item.title}
                  </motion.h1>

                  <motion.h2 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.12 }} className="text-base sm:text-lg md:text-xl font-light leading-snug mb-3 text-center md:text-left" style={{ color: '#0f172a' }}>
                    {item.cardExcerpt || `Read ${item.title} Story: Her Fight For the Better Futur`}
                  </motion.h2>

                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.18 }} className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-500 mt-2 justify-center md:justify-start">
                    <div className="mb-1 sm:mb-0">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}</div>
                    {item.location && <div className="hidden sm:inline">• {item.location}</div>}
                  </motion.div>
                </div>
              </div>

              <div className="mx-auto my-6 h-1 w-28 md:w-40 rounded-full" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})` }} />
            </motion.header>

            {/* CONTENT BLOCKS (centered on mobile) */}
            <article className="prose prose-lg mx-auto text-gray-800 text-center">
              {blocks.map((block, idx) => {
                if (!block) return null;

                if (block.type === 'heading' || block.type === 'heading1') {
                  const grad = headingGradientFor(idx);
                  return (
                    <motion.h2 key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1 + idx * 0.02} className="font-light text-xl sm:text-2xl md:text-3xl mt-8 mb-4 leading-tight text-center" style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: `0 8px 30px ${emeraldMid}22`, padding: '6px 10px', borderRadius: 8 }}>
                      {block.data?.text}
                    </motion.h2>
                  );
                }

                if (block.type === 'subheading' || block.type === 'heading2') {
                  const grad = headingGradientFor(idx);
                  return (
                    <motion.h3 key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1 + idx * 0.02} className="font-light text-base sm:text-lg mt-6 mb-3 text-center" style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: `0 6px 20px ${emeraldMid}11` }}>
                      {block.data?.text}
                    </motion.h3>
                  );
                }

                if (block.type === 'paragraph') {
                  return (
                    <motion.p key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1 + idx * 0.02} className="text-sm sm:text-base leading-relaxed mt-4 text-center" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9))', padding: '12px 14px', borderRadius: 12, boxShadow: '0 8px 30px rgba(2,6,23,0.06)' }}>
                      {block.data?.text}
                    </motion.p>
                  );
                }

                if (block.type === 'quote') {
                  return (
                    <motion.blockquote key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1 + idx * 0.02} className="mt-6 p-6 rounded-xl text-center" style={{ background: '#f8fafc', borderLeft: `6px solid ${saffronMid}`, boxShadow: '0 10px 30px rgba(2,6,23,0.04)' }}>
                      <p className="italic">{block.data?.text}</p>
                      {block.data?.author && <div className="mt-3 text-sm">— {block.data.author}</div>}
                    </motion.blockquote>
                  );
                }

                if (block.type === 'media') {
                  const url = block.data?.url;
                  const caption = block.data?.caption || block.data?.originalName || '';
                  if (!url) return null;
                  const isImage = /\.(jpe?g|png|webp|gif|avif)$/i.test(url) || block.data?.mediaType === 'image';
                  const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(url) || block.data?.mediaType === 'video';

                  if (isImage) {
                    return (
                      <motion.figure key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-6 flex justify-center">
                        <img src={url} alt={caption || item.title} className="w-full md:w-3/4 rounded-xl shadow-xl" style={{ boxShadow: `0 30px 60px rgba(2,6,23,0.12), 0 8px 30px ${saffronMid}22` }} />
                        {caption ? <figcaption className="mt-2 text-sm text-gray-600 text-center">{caption}</figcaption> : null}
                      </motion.figure>
                    );
                  }

                  if (isVideo) {
                    return (
                      <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-6">
                        <video controls src={url} className="w-full rounded-xl shadow-lg" />
                        {caption ? <div className="mt-2 text-sm text-gray-600 text-center">{caption}</div> : null}
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-6 text-center">
                      <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        {caption || 'View file'}
                      </a>
                    </motion.div>
                  );
                }

                return (
                  <motion.pre key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-6 bg-slate-50 p-4 rounded-md text-sm text-gray-600 text-center">
                    {JSON.stringify(block, null, 2)}
                  </motion.pre>
                );
              })}

              <div className="mt-10 text-center">
                <motion.a href="/donate" role="button" initial={{ scale: 0.98, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45 }} className="inline-block px-8 py-3 rounded-full font-medium" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, color: '#fff', boxShadow: `0 10px 30px ${emeraldMid}22, 0 6px 18px ${saffronMid}33` }}>
                  ❤️ Donate Now
                </motion.a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}