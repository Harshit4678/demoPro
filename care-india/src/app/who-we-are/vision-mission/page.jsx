"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useThemeStore } from "@/stores/themeStore";

export default function VisionMissionPage() {
  const { saffronMid, emeraldMid, GRAD_SOFT } = useThemeStore();

  const founderImg = "/images/bgimg/AwardHero.png";
  const missionImg = "/images/bgimg/oldAge.jpg";

  // branded glows
  const glowSoft = `0 12px 40px ${saffronMid}22, 0 6px 24px ${emeraldMid}11`;
  const glowStrong = `0 30px 80px ${saffronMid}33, 0 12px 40px ${emeraldMid}22`;

  const cardVariant = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 overflow-hidden">
      <style>{`
        @keyframes saffronPulseSafe {
          0% { background-position: 0% 50%; filter: brightness(1); }
          50% { background-position: 100% 50%; filter: brightness(1.04); }
          100% { background-position: 0% 50%; filter: brightness(1); }
        }
        .hero-clip { contain: paint; -webkit-transform: translateZ(0); }
      `}</style>

      {/* HERO */}
      <section
        className="w-full h-[60vh] flex flex-col items-center justify-center text-center relative overflow-hidden hero-clip"
        style={{
          background: `linear-gradient(120deg, ${saffronMid} 0%, #FFB347 40%, rgba(255,179,71,0.95) 100%)`,
          backgroundSize: "200% 200%",
          animation: "saffronPulseSafe 6s ease-in-out infinite",
        }}
      >
        <motion.div initial="hidden" animate="visible" variants={cardVariant} className="max-w-4xl px-6 z-10">
          <h1
            className="text-3xl md:text-5xl font-light text-white leading-tight drop-shadow-lg"
            
          >
            Vision & Mission
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/90">
            Empowering communities through education, healthcare, and sustainable development.
          </p>
        </motion.div>

        <div
          aria-hidden
          className="absolute right-8 top-8 w-80 h-80 rounded-full opacity-28 blur-3xl pointer-events-none"
          style={{ background: GRAD_SOFT }}
        />
      </section>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <nav className="text-sm text-gray-600 mb-10 flex items-center gap-2 justify-center">
          <span className="text-indigo-600">Home</span>
          <span className="text-gray-400">/</span>
          <span className="text-indigo-600">Who We Are</span>
          <span className="text-gray-400">/</span>
          <span className="font-medium">Vision & Mission</span>
        </nav>

        {/* VISION */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 rounded-3xl p-10 mb-24"
          style={{ boxShadow: glowStrong, background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.88))' }}
        >
          <h2 className="text-3xl md:text-4xl font-light text-center mb-3" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Vision of Care India Welfare Trust
          </h2>
          <div className="w-28 h-1 mx-auto my-4 rounded-full" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})` }} />

          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto text-center">
            Care India Welfare Trust expects a society where every individual, regardless of their socio-economic background, has access to quality education, healthcare, and sustainable livelihood opportunities. The organization aims to empower communities, ensuring that excluded populations can lead distinguished and self-reliant lives. By focusing on holistic development, the Trust aims to bridge societal gaps, promoting an environment where equality and social justice win. Their vision contains the upliftment of underprivileged sections through targeted interventions in education, health, and economic empowerment, ultimately contributing to the nation's inclusive growth.
          </p>

          <div className="mt-10 flex justify-center">
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: glowSoft }}>
              <Image src={founderImg} alt="Founder receiving award" width={900} height={520} className="w-full h-auto object-cover" />
            </div>
          </div>
        </motion.section>

        {/* MISSION */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl p-10"
          style={{ background: `linear-gradient(180deg, rgba(255,247,236,0.6), rgba(238,255,249,0.6))`, boxShadow: glowStrong }}
        >
          <h2 className="text-3xl md:text-4xl font-light text-center mb-3" style={{ background: `linear-gradient(90deg, ${emeraldMid}, ${saffronMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Mission of Care India Welfare Trust
          </h2>
          <div className="w-28 h-1 mx-auto my-4 rounded-full" style={{ background: `linear-gradient(90deg, ${emeraldMid}, ${saffronMid})` }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <motion.div whileHover={{ translateY: -6 }} style={{ boxShadow: glowSoft }} className="rounded-2xl p-6 bg-white">
              <h3 className="text-xl font-light mb-2" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>Mission 1 — Education & Skills</h3>
              <p className="text-gray-700 leading-relaxed">
                The mission of Care India Welfare Trust is to execute exhaustive programs that address the required needs of underserved communities. In education, they focus on improving access to quality learning, reducing dropout rates, and promoting skill development to improve employability.
              </p>
            </motion.div>

            <motion.div whileHover={{ translateY: -6 }} style={{ boxShadow: glowSoft }} className="rounded-2xl p-6 bg-white">
              <h3 className="text-xl font-light mb-2" style={{ background: `linear-gradient(90deg, ${emeraldMid}, ${saffronMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>Mission 2 — Health & Livelihoods</h3>
              <p className="text-gray-700 leading-relaxed">
                In healthcare, the Trust aims to provide essential medical services, raise awareness about health issues, and encourage better health outcomes. Through livelihood initiatives, they seek to create sustainable income opportunities, particularly for women and youth, promoting economic independence.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 flex justify-center">
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: glowSoft }}>
              <Image src={missionImg} alt="Community Mission" width={900} height={520} className="w-full h-auto object-cover" />
            </div>
          </div>
        </motion.section>
      </div>

      {/* CTA */}
      <section className="py-20 text-center text-white" >
        <motion.h3 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-light drop-shadow-lg" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>
          Join Hands to Empower Communities
        </motion.h3>
        <p className="mt-4 text-black/60 max-w-2xl mx-auto">Every effort counts — contribute to the vision of a healthy, educated, and empowered nation.</p>

        <div className="mt-8 flex justify-center gap-4">
          <a href="/donate" className="px-6 py-2 rounded-lg font-medium text-white" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, boxShadow: glowStrong }}>
            Donate Now
          </a>
          <a href="/volunteer" className="px-6 py-2 rounded-lg font-medium  text-black/60 hover:bg-amber-200/70 hover:text-amber-950" >
            Volunteer With Us
          </a>
        </div>
      </section>
    </main>
  );
}
