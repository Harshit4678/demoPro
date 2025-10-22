"use client";

import React, { useState } from "react";
import TopCarousel from "@/components/TopCarousel";
import { useThemeStore } from "@/stores/themeStore";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function NgoCollabPage() {
  const { saffronMid, emeraldMid, GRAD_SOFT, headingAnimEnabled } = useThemeStore();

  const [form, setForm] = useState({
    ngoName: "", registrationDetails: "", yearEstablished: "", workingAreas: "",
    location: "", phone: "", address: "", website: "", contactPerson: "", designation: "",
    contactNumber: "", email: "", partnershipAreas: "", notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  function handleChange(e) { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); }

  function validate() {
    if (!form.ngoName.trim()) return "NGO name required";
    // primary contact: prefer contactNumber, fallback to phone
    const primaryContact = (form.contactNumber || form.phone || "").replace(/\D/g, "");
    if (!primaryContact || primaryContact.length < 7) return "Primary contact number required";
    if (!form.contactPerson.trim()) return "Contact person required";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email required";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault(); setError("");
    const v = validate(); if (v) return setError(v);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("formType", "ngo");
      Object.entries(form).forEach(([k,v]) => fd.append(k, v || ""));
      const res = await fetch(`${API_BASE}/api/leads`, { method: "POST", body: fd, credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data?.error || data?.message || "Submission failed");
      else {
        setSuccess({ referenceId: data.referenceId || null, message: data.message || "Request received" });
        setForm({ ngoName:"", registrationDetails:"", yearEstablished:"", workingAreas:"", location:"", phone:"", address:"", website:"", contactPerson:"", designation:"", contactNumber:"", email:"", partnershipAreas:"", notes:"" });
      }
    } catch (err) { console.error(err); setError("Network error — try again"); }
    finally { setLoading(false); }
  }

  // theme shadows & subtle page gradient
  const breadcrumbShadow = `0 10px 40px ${saffronMid}12, 0 6px 20px ${emeraldMid}0f`;
  const headerShadow = `0 18px 60px ${saffronMid}10, 0 8px 30px ${emeraldMid}0d`;
  const cardShadow = `0 28px 80px ${saffronMid}12, 0 8px 30px ${emeraldMid}08, inset 0 1px 0 #ffffff10`;

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, #f8fafc 0%, rgba(250,250,252,0.6) 40%, rgba(255,255,255,1) 100%)`
      }}
    >
      {/* SECTION 1: Carousel */}
      <section id="section-1" className="w-full">
        <TopCarousel />
      </section>

      {/* SECTION 2: Content */}
      <section id="section-2" className="bg-transparent">
        {/* Breadcrumb */}
        <div
          className="max-w-4xl mx-auto px-6 py-3 my-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.95)", boxShadow: breadcrumbShadow, backdropFilter: "saturate(120%) blur(6px)" }}
        >
          <div className="flex items-center justify-between">
            <nav className="text-sm text-gray-600">
              <a href="/" className="hover:underline">Home</a>
              <span className="mx-2 text-gray-300">›</span>
              <a href="/get-involved" className="hover:underline">Get Involved</a>
              <span className="mx-2 text-gray-300">›</span>
              <span className="font-medium text-gray-800">NGO Collaboration</span>
            </nav>

            <a
              href="/get-involved"
              className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-md shadow"
              style={{ background: GRAD_SOFT, color: "white", boxShadow: `0 6px 20px ${emeraldMid}18` }}
            >
              Explore ways to help
            </a>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-6 mt-2 mb-16">
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: headingAnimEnabled ? 0.45 : 0 }}
            className="bg-white p-6 rounded-xl"
            style={{ boxShadow: headerShadow, border: "none" }}
          >
            <div>
              <h1
                className="text-2xl md:text-3xl font-semibold leading-tight"
                style={{
                  background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`,
                  WebkitBackgroundClip: "text",
                  color: "transparent"
                }}
              >
                Form to apply for NGO Collaboration
              </h1>
              <p className="mt-2 text-sm text-gray-600">Tell us about your organisation and the kinds of partnerships you're interested in.</p>
            </div>
          </motion.header>

          <section className="mt-6 bg-white rounded-2xl p-6" style={{ boxShadow: cardShadow }}>
            {/* internal subheading */}
            <h2
              className="text-lg font-semibold mb-4 text-center"
              style={{
                background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`,
                WebkitBackgroundClip: "text",
                color: "transparent"
              }}
            >
              NGO Collaboration Form
            </h2>

            {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>}

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">NGO Name <span className="text-rose-500">*</span></label>
                    <input
                      name="ngoName"
                      value={form.ngoName}
                      onChange={handleChange}
                      placeholder="e.g., Helping Hands Foundation"
                      className="mt-1 w-full rounded-lg p-3 border border-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Details</label>
                    <input name="registrationDetails" value={form.registrationDetails} onChange={handleChange} placeholder="Reg. No / Date (e.g., 12345 / 01-01-2010)" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year of Establishment</label>
                    <input name="yearEstablished" value={form.yearEstablished} onChange={handleChange} placeholder="e.g., 2005" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Working Areas</label>
                    <input name="workingAreas" value={form.workingAreas} onChange={handleChange} placeholder="Education, Health, Environment" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location (City, State, Country)</label>
                    <input name="location" value={form.location} onChange={handleChange} placeholder="Mumbai, Maharashtra, India" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} placeholder="Street, Area, City, ZIP" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input name="website" value={form.website} onChange={handleChange} placeholder="https://www.yourngo.org" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email <span className="text-rose-500">*</span></label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="info@yourngo.org"
                      className="mt-1 w-full rounded-lg p-3 border border-gray-100"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Person <span className="text-rose-500">*</span></label>
                    <input
                      name="contactPerson"
                      value={form.contactPerson}
                      onChange={handleChange}
                      placeholder="Name of primary contact"
                      className="mt-1 w-full rounded-lg p-3 border border-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                    <input name="designation" value={form.designation} onChange={handleChange} placeholder="Executive Director / Program Manager" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Primary Contact Number <span className="text-rose-500">*</span></label>
                  <input
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={handleChange}
                    placeholder="+91 98xxxxxxx"
                    className="mt-1 w-full rounded-lg p-3 border border-gray-100"
                    required
                  />
                  <div className="text-xs text-gray-400 mt-1">If you prefer, you can also provide a general phone number above.</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Area(s) of Partnership</label>
                  <input name="partnershipAreas" value={form.partnershipAreas} onChange={handleChange} placeholder="Education, Skill-building, Health Camps" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows="4" placeholder="Any additional context or requests" className="mt-1 w-full rounded-lg p-3 border border-gray-100"></textarea>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    Required fields are marked with <span className="text-rose-500">*</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-medium shadow"
                      style={{
                        background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`,
                        color: "white",
                        opacity: loading ? 0.75 : 1,
                        boxShadow: `0 10px 40px ${saffronMid}14`
                      }}
                    >
                      {loading ? "Submitting..." : "Submit Request"}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setForm({ ngoName:"", registrationDetails:"", yearEstablished:"", workingAreas:"", location:"", phone:"", address:"", website:"", contactPerson:"", designation:"", contactNumber:"", email:"", partnershipAreas:"", notes:"" }); setError(""); }}
                      className="px-4 py-2 rounded-lg border"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-6 bg-green-50 rounded-lg">
                <h2 className="text-lg font-semibold">Thanks — we got your request</h2>
                <p className="mt-2">We'll review and get back to you shortly.</p>
                {success?.referenceId && <p className="mt-2 text-sm text-gray-600">Reference ID: <strong>{success.referenceId}</strong></p>}
                <div className="mt-4">
                  <button onClick={() => setSuccess(null)} className="px-3 py-2 rounded-lg" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, color: "white" }}>
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
