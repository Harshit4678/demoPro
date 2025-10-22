// app/who-we-are/about/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useThemeStore } from "@/stores/themeStore";

export default function AboutPage() {
  const { saffronMid, emeraldMid, GRAD, GRAD_SOFT } = useThemeStore();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:5000";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_ORIGIN}/api/about/timeline`);
        const data = await res.json();
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch timeline:", err);
        if (!mounted) return;
        setItems([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [API_ORIGIN]);

  const glowShadow = `0 12px 30px ${saffronMid}22, 0 6px 18px ${emeraldMid}11`;

  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center px-6 md:px-12 pt-16 pb-12 font-sans"
      style={{
        background: `linear-gradient(180deg, rgba(255,250,245,0.9), ${GRAD_SOFT})`,
      }}
    >
      {/* Section 1: Founder profile — SIMPLE (no box) but themed */}
      <section className="w-full min-h-screen flex flex-col justify-center items-center px-6 md:px-12 mb-8">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[auto_1px_1.2fr] items-center pl-6 md:pl-10 gap-6">
          {/* Left: Founder photo and name */}
          <div className="flex flex-col justify-center items-center text-center space-y-3 p-2">
            <div className="relative w-52 h-52 rounded-full overflow-hidden shadow-md">
              <Image
                src="/images/about/Founder.jpg"
                alt="Mahinder Dobriyal"
                fill
                style={{ objectFit: "cover" }}
                sizes="(min-width: 768px) 208px, 208px"
              />
            </div>

            <div className="flex flex-col items-center text-center">
              <h3
                className="text-xl font-medium tracking-wide"
                style={{
                  background: `linear-gradient(90deg, ${emeraldMid}, ${saffronMid})`,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Mahinder Dobriyal
              </h3>
              <div className="w-16 h-1 bg-emerald-500 mx-auto my-2 rounded-full" />
              <p className="text-xl font-medium">Founder</p>
              <p className="text-xl text-slate-600">of Care India Welfare Trust</p>
            </div>
          </div>

          {/* Divider column */}
          <div className="hidden md:block h-full w-px bg-slate-300/60 mx-10" />

          {/* Right: Biography text - SIMPLE container (no heavy box) */}
          <div
            className="overflow-y-auto md:pl-12 py-8 prose text-slate-700 text-[18px] leading-relaxed rounded-lg max-h-[80vh] pb-6 text-justify"
            style={{
              background: "transparent",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <p>
              <span className="text-[26px] text-amber-600 font-bold">C</span>are India Welfare Trust was founded by Mahinder Dobriyal in 2011,
              moved by his passion for inspiring the underprivileged and his commitment to creating a more equitable society. The organization focuses on supporting poor children and families who struggle daily. Seeing their hardships inspired the establishment of an NGO dedicated to providing education and assistance to those without support. Their mission is to stand by the underprivileged, offering a helping hand to empower them and help turn their dreams into reality.
            </p>
            <p className="pt-5">
              Right from the beginning, we have aimed for quality education for every child, and empowered women to lead with strength and dignity, while the economically disadvantaged receive support to succeed. Together, we have become the viewers of a great transformation: children accessing education, women standing tall as community leaders, and families finding new hope.
            </p>
            <p className="pt-5">
              Mahinder Dobriyal saw beyond the seasons of immediate relief. He imagines a tomorrow where everyone can have equity, dignity, and well-being. Using the guiding light, we fly to reach out even further and deepen the impact that we make by opening new doors for life to those in need. The challenge that lies ahead is to ensure that there is a comprehensive and inclusive society in which no one stands deserted. With tireless and careful efforts, we incorporate into the world material his vision.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Timeline with centered heading */}
      <section className="w-full py-12">
        <div className="max-w-5xl mx-auto px-4 space-y-10 relative">
          <div className="text-center mb-6">
            <h2
              className="text-3xl md:text-5xl md:pb-5 font-light"
              style={{
                background: `linear-gradient(90deg, ${emeraldMid}, ${saffronMid})`,
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              A walk through our journey
            </h2>
            <div className="mx-auto mt-3 w-28 h-1 rounded-full"
                 style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})` }} />
          </div>

          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full">
            <div className="w-1 bg-gradient-to-b from-emerald-400 via-emerald-200 to-transparent rounded-full h-full" />
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
              <div className="w-4 h-4 rounded-full bg-emerald-600 animate-pulse" />
            </div>
          </div>

          {/* Loading / Empty / Items */}
          {loading ? (
            <div className="w-full py-20 flex items-center justify-center">
              <div className="text-slate-600">Loading timeline...</div>
            </div>
          ) : items.length === 0 ? (
            <div className="w-full py-20 flex items-center justify-center">
              <div className="text-slate-600">No timeline entries yet.</div>
            </div>
          ) : (
            items.map((it, idx) => {
              const isLeftText =
                it.side === "left" ? true : it.side === "right" ? false : idx % 2 === 0;

              let imgUrl = it.imagePath || it.image || it.imageUrl || null;
              if (imgUrl && imgUrl.startsWith("/uploads")) imgUrl = `${API_ORIGIN}${imgUrl}`;
              if (imgUrl && !/^https?:\/\//i.test(imgUrl) && !imgUrl.startsWith(API_ORIGIN) && !imgUrl.startsWith("/uploads") && !imgUrl.startsWith("/")) {
                imgUrl = `${API_ORIGIN}/uploads/${imgUrl}`;
              }

              return (
                <div key={it._id || idx} className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                  {!isLeftText ? (
                    <>
                      <div className="order-1 md:order-1">
                        {imgUrl ? (
                          <img src={imgUrl} alt={it.title} className="w-full h-64 object-cover rounded-lg shadow-sm md:-ml-5" />
                        ) : (
                          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-slate-400">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="order-2 md:order-2 md:pl-10">
                        <div
                          className="p-6 rounded-lg"
                          style={{
                            boxShadow: glowShadow,
                            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.96))",
                          }}
                        >
                          <div className="text-sm text-emerald-600 font-medium">{it.session}</div>
                          <h3
                            className="text-2xl font-light mt-2"
                            style={{
                              background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`,
                              WebkitBackgroundClip: "text",
                              color: "transparent",
                            }}
                          >
                            {it.title}
                          </h3>
                          <p className="mt-3 text-slate-700">{it.paragraph}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="order-1 md:order-1 md:pr-10">
                        <div
                          className="p-6 rounded-lg"
                          style={{
                            boxShadow: glowShadow,
                            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.96))",
                          }}
                        >
                          <div className="text-sm text-emerald-600 font-medium">{it.session}</div>
                          <h3
                            className="text-2xl font-light mt-2"
                            style={{
                              background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`,
                              WebkitBackgroundClip: "text",
                              color: "transparent",
                            }}
                          >
                            {it.title}
                          </h3>
                          <p className="mt-3 text-slate-700">{it.paragraph}</p>
                        </div>
                      </div>
                      <div className="order-2 md:order-2">
                        {imgUrl ? (
                          <img src={imgUrl} alt={it.title} className="w-full h-64 object-cover rounded-lg shadow-sm md:ml-5" />
                        ) : (
                          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-slate-400">
                            No image
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      <style jsx global>{`
        .prose::-webkit-scrollbar { width: 0; height: 0; }
        .prose { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 767px) {
          .prose { padding: 0 6px; }
        }
      `}</style>
    </main>
  );
}
