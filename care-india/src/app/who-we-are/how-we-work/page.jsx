"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useThemeStore } from "@/stores/themeStore";

export default function HowWeWorkPage() {
  const { saffronMid, emeraldMid, GRAD, GRAD_SOFT, animationEnabled, animationSpeed } = useThemeStore();

  const timeline = [
    {
      title: "Identifying Needs and Building Awareness",
      paragraph:
        "We collaborate with communities to identify their unique needs through surveys, meetings, and discussions. Our team raises awareness about social, health, and educational issues, fostering community engagement and empowering them to take action.",
      image: "/images/about/Health.jpg",
    },
    {
      title: "Implementing Sustainable Programs",
      paragraph:
        "We design and execute programs focused on education, healthcare, women empowerment, and livelihood support. By partnering with local organizations and volunteers, we ensure our initiatives are sustainable and tailored to address specific community challenges effectively.",
      image: "/images/about/health9.jpg",
    },
    {
      title: "Monitoring Progress and Measuring Impact",
      paragraph:
        "We continuously monitor the progress of our programs to ensure they meet their objectives. Regular evaluations and feedback help us refine our approach, maximize impact, and ensure that the communities we serve experience meaningful and lasting change.",
      image: "/images/about/oldAge.jpg",
    },
  ];

  const stats = [
    { value: "95K+", label: "Children Treated" },
    { value: "1.80L+", label: "Parents Empowered" },
    { value: "95K+", label: "Women Empowered" },
    { value: "1.25L+", label: "Skilled through Courses" },
  ];

  const process = [
    { id: 1, title: "Research Needs", text: "Assess community needs through surveys and local interactions to understand pressing issues and areas requiring immediate attention." },
    { id: 2, title: "Build Awareness", text: "Conduct awareness campaigns and workshops to educate communities on important topics like health, education, and women's empowerment." },
    { id: 3, title: "Develop Programs", text: "Design tailored programs focusing on healthcare, education, and sustainable livelihood, ensuring they align with community needs and goals." },
    { id: 4, title: "Partner Locally", text: "Collaborate with local organizations, volunteers, and government bodies to ensure effective implementation and maximum outreach." },
    { id: 5, title: "Implement Initiatives", text: "Roll out initiatives, mobilize resources, and provide training and support to community members for sustainable development." },
    { id: 6, title: "Evaluate Impact", text: "Evaluate the impact of programs through data analysis, feedback, and field visits to measure success and areas for improvement." },
  ];

  const cardMotion = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5 * (animationEnabled ? animationSpeed : 1) },
  };

  // branded glow shadows
  const glowShadow = `0 12px 30px ${saffronMid}22, 0 6px 18px ${emeraldMid}11`;
  const strongGlow = `0 20px 60px ${saffronMid}33, 0 8px 30px ${emeraldMid}22`;

  return (
    <>
      {/* FULL-WIDTH VIDEO - BLEED (no margins) */}
      <section className="w-full h-72 md:h-[520px] overflow-hidden relative">
        <video
          className="w-full h-full object-cover"
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.35))" }} />

        <div className="absolute left-6 bottom-6 text-white z-10">
          <motion.h2
            {...cardMotion}
            className="text-2xl md:text-4xl font-light drop-shadow-md"
            style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}
          >
            How we work
          </motion.h2>
          <motion.p {...cardMotion} transition={{ delay: 0.15, duration: 0.5 * (animationEnabled ? animationSpeed : 1) }} className="text-sm md:text-base">
            Process, partners and impact — community first.
          </motion.p>
        </div>

        {/* gradient glow */}
        <div
          aria-hidden
          className="absolute right-8 top-8 w-72 h-72 rounded-full opacity-40 blur-3xl pointer-events-none"
          style={{ background: GRAD_SOFT }}
        />
      </section>

      {/* page content constrained */}
      <main className="max-w-6xl mx-auto px-6 py-12 text-gray-800">
        {/* BREADCRUMB */}
        <nav className="text-sm text-gray-600 mb-8">
          Home <span className="mx-2">&gt;</span> Who we are <span className="mx-2">&gt;</span> How we work
        </nav>

        {/* BIG SECTION HEADING */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>
            How we work
          </h1>
          <p className="mt-2 text-gray-600">Our approach from assessment to sustainable impact.</p>
        </header>

        {/* ALTERNATING TIMELINE (image first on row 1, then text-first next row) */}
        <section className="space-y-12">
          {timeline.map((item, idx) => {
            const imageFirst = idx % 2 === 0; // even index -> image left, text right
            return (
              <motion.div
                key={item.title}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
                {...cardMotion}
              >
                {imageFirst ? (
                  <>
                    {/* IMAGE LEFT - full within column */}
                    <div className="h-64 md:h-72 rounded-lg overflow-hidden" style={{ boxShadow: strongGlow }}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={1600}
                        height={1000}
                        className="w-full h-full object-cover"
                        placeholder="empty"
                      />
                    </div>

                    {/* TEXT RIGHT */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-6 rounded-lg transition-transform duration-200"
                      style={{ boxShadow: glowShadow }}
                    >
                      <h3 className="text-xl font-light" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>{item.title}</h3>
                      <p className="mt-3 text-gray-600">{item.paragraph}</p>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* TEXT LEFT */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-6 rounded-lg transition-transform duration-200"
                      style={{ boxShadow: glowShadow }}
                    >
                      <h3 className="text-xl font-light" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>{item.title}</h3>
                      <p className="mt-3 text-gray-600">{item.paragraph}</p>
                    </motion.div>

                    {/* IMAGE RIGHT */}
                    <div className="h-64 md:h-72 rounded-lg overflow-hidden" style={{ boxShadow: strongGlow }}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={1600}
                        height={1000}
                        className="w-full h-full object-cover"
                        placeholder="empty"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </section>

        {/* PERFORMANCE NUMBERS */}
        <section className="mt-12">
          <div className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-lg shadow-inner" style={{ boxShadow: `0 8px 30px ${emeraldMid}11` }}>
            <h3 className="text-2xl font-light" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>Our Performance In Numbers</h3>
            <p className="text-sm text-gray-600">Impacting communities at scale</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="p-4 rounded-lg text-center bg-white flex flex-col items-center transition-shadow"
                  style={{ boxShadow: glowShadow }}
                >
                  <div className="text-3xl font-extrabold tracking-tight text-gray-900">{s.value}</div>
                  <div className="text-xs mt-1 text-gray-600">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* OUR PROCESS — ADVANCED TIMELINE with individual descriptions */}
        <section className="mt-12">
          <h3 className="text-2xl font-light mb-6 text-center" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>Our Process</h3>
          <div className="relative">
            {/* central vertical line on md+ */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 rounded-full" style={{ background: `linear-gradient(180deg, ${saffronMid}, ${emeraldMid})` }} />

            <div className="space-y-8">
              {process.map((step, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={step.id}
                    className="md:grid md:grid-cols-2 md:items-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                  >
                    {isLeft ? (
                      <>
                        <div className="md:col-start-1 md:col-end-2 md:pl-0 pr-6 flex justify-end">
                          <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-lg max-w-md w-[70%] md:mr-10 transition-transform duration-200" style={{ boxShadow: glowShadow }}>
                            <h4 className="font-light text-gray-900" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>{step.title}</h4>
                            <p className="text-sm text-gray-600 mt-2">{step.text}</p>
                          </motion.div>
                        </div>

                        <div className="md:col-start-2 md:col-end-3 md:pl-6 relative">
                          <div className="hidden md:block absolute left-0 -ml-6 top-2">
                            <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center font-bold" style={{ boxShadow: glowShadow, color: saffronMid }}>
                              {step.id}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="md:col-start-1 md:col-end-2 md:pr-6 relative">
                          <div className="hidden md:block absolute right-0 -mr-6 top-2">
                            <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center font-bold" style={{ boxShadow: glowShadow, color: emeraldMid }}>
                              {step.id}
                            </div>
                          </div>
                        </div>

                        <div className="md:col-start-2 md:col-end-3 md:pl-0 pl-6 flex justify-start">
                          <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-lg max-w-md w-[70%] md:ml-10 transition-transform duration-200" style={{ boxShadow: glowShadow }}>
                            <h4 className="font-light text-gray-900" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>{step.title}</h4>
                            <p className="text-sm text-gray-600 mt-2">{step.text}</p>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* mobile-friendly numbered list under the visuals */}
            <div className="mt-8 md:hidden bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold">Process (steps)</h4>
              <ol className="mt-3 list-decimal list-inside space-y-2 text-sm text-gray-700">
                {process.map((p) => (
                  <li key={p.id}>
                    <span className="font-medium">{p.title}:</span> {p.text}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 text-center">
          <p className="text-lg font-medium">Want to partner or volunteer with us?</p>
          <div className="mt-4 flex justify-center">
            <a
              className="inline-block px-6 py-2 rounded-md text-white font-medium shadow-xl hover:shadow-2xl transition-shadow"
              href="/contact"
              style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, boxShadow: strongGlow }}
            >
              Get in touch
            </a>
          </div>
        </section>
      </main>
    </>
  );
}