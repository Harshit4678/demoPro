"use client";

import React, { useState } from "react";
import TopCarousel from "@/components/TopCarousel";
import { useThemeStore } from "@/stores/themeStore";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function CareerFormPage() {
  const { saffronMid, emeraldMid, GRAD_SOFT, headingAnimEnabled } = useThemeStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    jobProfileName: "",
    desiredJobProfile: "",
    dob: "",
    message: ""
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const maxFileSize = 10 * 1024 * 1024;
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFile(e) {
    setError("");
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > maxFileSize) return setError("File size should be <= 10MB");
    if (!allowedTypes.includes(f.type)) return setError("Only PDF / DOC / DOCX allowed");
    setFile(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Please enter your name");
    if (!form.contact.trim() || !/^[0-9]{7,15}$/.test(form.contact)) return setError("Please enter a valid contact number");
    if (!file) return setError("Please upload your resume (PDF/DOC/DOCX)");
    if (!form.jobProfileName.trim()) return setError("Please enter job profile name");
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return setError("Please enter a valid email");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("formType", "career");
      Object.keys(form).forEach(k => fd.append(k, form[k] || ""));
      fd.append("files", file);

      const res = await fetch(`${API_BASE}/api/leads`, { method: "POST", body: fd, credentials: "include" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || data.error || "Submission failed");
      } else {
        setSuccess({ referenceId: data.referenceId || null, message: data.message || "Application received." });
        setForm({ name: "", email: "", contact: "", jobProfileName: "", desiredJobProfile: "", dob: "", message: "" });
        setFile(null);
      }
    } catch (err) {
      console.error(err);
      setError("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  // theme shadows & subtle page gradient
  const breadcrumbShadow = `0 8px 30px ${saffronMid}1a, 0 4px 12px ${emeraldMid}12`;
  const headerShadow = `0 20px 60px ${saffronMid}14, 0 6px 24px ${emeraldMid}0f`;
  const formBoxShadow = `0 28px 80px ${saffronMid}12, 0 8px 30px ${emeraldMid}0d, inset 0 1px 0 #ffffff10`;

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, #f8fafc 0%, rgba(245,247,250,0.6) 40%, rgba(255,255,255,1) 100%)`
      }}
    >
      {/* ===== SECTION 1: Carousel (treat this as full section) ===== */}
      <section id="section-1" className="w-full">
        <TopCarousel />
      </section>

      {/* ===== SECTION 2: Content (starts after carousel) ===== */}
      <section id="section-2" className="bg-transparent">
        {/* Breadcrumb (no border — themed shadow + rounded) */}
        <div
          className="max-w-7xl mx-auto px-6 py-3 my-4 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.85)",
            boxShadow: breadcrumbShadow,
            backdropFilter: "saturate(120%) blur(6px)"
          }}
        >
          <div className="flex items-center justify-between">
            <nav className="text-sm text-gray-600">
              <a href="/" className="hover:underline">Home</a>
              <span className="mx-2 text-gray-300">›</span>
              <a href="/get-involved" className="hover:underline">Get Involved</a>
              <span className="mx-2 text-gray-300">›</span>
              <span className="font-medium text-gray-800">Career</span>
            </nav>

            <a
              href="/get-involved"
              className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-md shadow"
              style={{
                background: GRAD_SOFT,
                color: "white",
                boxShadow: `0 6px 20px ${emeraldMid}18`
              }}
            >
              Explore ways to help
            </a>
          </div>
        </div>

        {/* Page container */}
        <main className="max-w-5xl mx-auto px-6 mt-2 mb-16">
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: headingAnimEnabled ? 0.45 : 0 }}
            className="bg-white p-6 rounded-xl"
            style={{ boxShadow: headerShadow, border: "none" }}
          >
            <div className="md:flex md:items-center md:justify-between gap-6">
              <div>
                <h1
                  className="text-2xl md:text-3xl font-semibold leading-tight"
                  style={{
                    background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`,
                    WebkitBackgroundClip: "text",
                    color: "transparent"
                  }}
                >
                  Form to apply for a career in our NGO
                </h1>
                <p className="mt-2 text-sm text-gray-600">Join our mission — fill the form below and attach your resume.</p>
              </div>

              <div className="mt-4 md:mt-0">
                <div className="text-right">
                  <a
                    href="/about"
                    className="inline-block text-sm px-4 py-2 rounded shadow-sm"
                    style={{
                      border: "none",
                      background: `${saffronMid}10`,
                      color: saffronMid,
                      boxShadow: `0 6px 20px ${saffronMid}10`
                    }}
                  >
                    Learn about our work
                  </a>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Form card: no border, stronger theme shadows */}
          <section
            className="mt-6 bg-white rounded-2xl p-6"
            style={{ boxShadow: formBoxShadow }}
          >
            {/* Small themed subheading inside the form card */}
            <h2
              className="text-xl font-semibold mb-4 text-center"
              style={{
                background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`,
                WebkitBackgroundClip: "text",
                color: "transparent"
              }}
            >
              Career Form
            </h2>

            {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>}

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Grid: two columns on md */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-rose-500">*</span></label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Rahul Sharma"
                      className="mt-1 w-full rounded-lg p-3 focus:ring-2 focus:ring-opacity-60 border border-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number <span className="text-rose-500">*</span></label>
                    <input
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                      required
                      placeholder="Digits only — include country code if needed"
                      inputMode="numeric"
                      className="mt-1 w-full rounded-lg p-3 focus:ring-2 focus:ring-opacity-60 border border-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-lg p-3 focus:ring-2 focus:ring-opacity-60 border border-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      className="mt-1 w-full rounded-lg p-3 bg-white focus:ring-2 focus:ring-opacity-60 border border-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Profile Name <span className="text-rose-500">*</span></label>
                    <input
                      name="jobProfileName"
                      value={form.jobProfileName}
                      onChange={handleChange}
                      required
                      placeholder="Position you are applying for"
                      className="mt-1 w-full rounded-lg p-3 focus:ring-2 focus:ring-opacity-60 border border-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Desired Job Profile</label>
                    <input
                      name="desiredJobProfile"
                      value={form.desiredJobProfile}
                      onChange={handleChange}
                      placeholder="If different / additional preferences"
                      className="mt-1 w-full rounded-lg p-3 focus:ring-2 focus:ring-opacity-60 border border-gray-100"
                    />
                  </div>
                </div>

                {/* Resume (full width) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resume (PDF / DOC / DOCX) <span className="text-rose-500">*</span></label>

                  <div className="mt-2 flex items-center gap-4">
                    <label
                      htmlFor="resume"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer shadow-sm"
                      style={{ background: GRAD_SOFT, color: "white", boxShadow: `0 8px 28px ${emeraldMid}14` }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90">
                        <path d="M12 3v12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 7l4-4 4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 21H4a1 1 0 0 1-1-1V7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Attach resume
                    </label>

                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFile}
                      className="hidden"
                      required
                    />

                    <div className="text-sm text-gray-600">
                      {file ? (
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-xs mt-1">Size: {(file.size / 1024).toFixed(0)} KB</div>
                        </div>
                      ) : (
                        <div>No file attached — max 10MB</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message / Cover Letter</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Short message about your fit / motivation (optional)"
                    className="mt-1 w-full rounded-lg p-3 focus:ring-2 focus:ring-opacity-60 border border-gray-100"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    <span className="text-rose-500">*</span> Required fields
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-medium shadow"
                      style={{
                        background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`,
                        color: "white",
                        opacity: loading ? 0.7 : 1,
                        boxShadow: `0 10px 40px ${saffronMid}14`
                      }}
                    >
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setForm({ name: "", email: "", contact: "", jobProfileName: "", desiredJobProfile: "", dob: "", message: "" }); setFile(null); setError(""); }}
                      className="px-4 py-2 rounded-lg border"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-6 bg-green-50 rounded-lg">
                <h2 className="text-lg font-semibold">Thank you!</h2>
                <p className="mt-2 text-sm text-gray-700">Your application has been received.</p>
                {success.referenceId && <p className="mt-2 text-sm text-gray-600">Reference ID: <strong>{success.referenceId}</strong></p>}
                <div className="mt-4">
                  <button onClick={() => setSuccess(null)} className="px-4 py-2 rounded-lg" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, color: "white" }}>
                    Submit another
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </section>
    </div>
  );
}
