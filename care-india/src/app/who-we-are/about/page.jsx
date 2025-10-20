// app/who-we-are/about/page.jsx
"use client";
import React from "react";

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center px-6 md:px-12 pt-16 pb-12">
      {/* Section 1: Founder profile with correct divider positioned between columns */}
     <section className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-white via-emerald-50 to-white px-6 md:px-12">
<div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[auto_1px_1.2fr] items-center pl-10">
{/* Left: Founder photo and name */}
<div className="flex flex-col justify-center items-center text-center space-y-3">
  <img
    src="/images/about/Founder.jpg"
    alt="Mahinder Dobriyal"
    className="w-52 h-52 rounded-full object-cover shadow-lg mb-3"
  />
  <div className="flex flex-col items-center text-center">
    <h3 className="text-xl font-medium tracking-wide">Mahinder Dobriyal</h3>
    <div className="w-16 h-1 bg-emerald-500 mx-auto my-2 rounded-full" />
    <p className="text-xl font-medium">Founder</p>
    <p className="text-xl text-slate-600">of Care India Welfare Trust</p>
  </div>
</div>



{/* Divider column -- sits exactly between left and right on md+ */}
<div className="hidden md:block h-full w-px bg-slate-300/60 mx-10" />


{/* Right: Scrollable biography text (slightly wider now) */}
<div className="overflow-y-auto md:pl-20 py-4 prose text-slate-700 text-[18px] leading-relaxed rounded-lg bg-transparent shadow-none max-h-[65vh] pb-6 text-justify" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
<p>
<span className="text-[26px] text-amber-600 font-bold">C</span>are India Welfare Trust was founded by Mahinder Dobriyal in 2011, moved by his passion for inspiring the underprivileged and his commitment to creating a more equitable society. The organization focuses on supporting poor children and families who struggle daily. Seeing their hardships inspired the establishment of an NGO dedicated to providing education and assistance to those without support. Their mission is to stand by the underprivileged, offering a helping hand to empower them and help turn their dreams into reality.
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

      {/* Section 2: Info / Who we are */}
      <section className="w-full flex flex-col justify-center items-center bg-slate-50 px-6 md:px-12 py-16">
        <div className="w-full max-w-5xl bg-white rounded-2xl p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-emerald-700">Who we are</h2>
              <p className="mb-2 text-slate-700">
                Care India Welfare Trust works to create long-term, sustainable change in the lives of vulnerable children, women and families. Hum education, healthcare aur livelihood projects implement karte hain jisse community khud apne paon par khadi ho sake.
              </p>
              <p className="text-slate-700">
                We follow community-led planning, transparent operations and measurable impact tracking to ensure resources reach the people who need them most. Our goal is systemic change, not just temporary relief.
              </p>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-emerald-800">Our approach</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Quality primary education and scholarship support</li>
                <li>Women empowerment & livelihood programs</li>
                <li>Community health camps and awareness</li>
                <li>Holistic family-centric interventions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* Hide visible scrollbar while keeping scroll functionality */
        .prose::-webkit-scrollbar { width: 0; height: 0; }
        .prose { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
