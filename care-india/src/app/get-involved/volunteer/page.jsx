"use client";

import React, { useEffect, useState } from "react";
import TopCarousel from "@/components/TopCarousel";
import { useThemeStore } from "@/stores/themeStore";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function VolunteerPage() {
  const { saffronMid, emeraldMid, GRAD_SOFT, headingAnimEnabled } = useThemeStore();

  const [form, setForm] = useState({
    name: "", homeAddress: "", postalAddress: "", email: "", workCode: "",
    cell: "", preferredCallTime: "", dob: "", gender: "", nationality: "",
    bloodGroup: "", maritalStatus: "", durationOfStay: "", secondarySchool: "",
    graduation: "", postGraduation: "", otherQualifications: "", certifications: "",
    passportNumber: "", volunteerHours: "", workExperience: "", heardAbout: "",
    whyVolunteer: "", preferredArea: "", achievements: "", hobbies: "", about: "",
    emergencyName: "", emergencyNumber: ""
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (photo) {
      const url = URL.createObjectURL(photo);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhotoPreview(null);
    }
  }, [photo]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }
  function handleFile(setter, e) {
    const f = e.target.files?.[0];
    setter(f || null);
  }

  function validate() {
    if (!form.name.trim()) return "Name required";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email required";
    if (!form.cell || form.cell.replace(/\D/g, "").length < 7) return "Valid contact required";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const v = validate(); if (v) return setError(v);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("formType", "volunteer");
      Object.entries(form).forEach(([k,v]) => fd.append(k, v || ""));
      if (photo) fd.append("files", photo);
      if (identity) fd.append("files", identity);

      const res = await fetch(`${API_BASE}/api/leads`, { method: "POST", body: fd, credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || data?.message || "Submission failed");
      } else {
        setSuccess({ referenceId: data.referenceId || null, message: data.message || "Submission received" });
        setForm({
          name: "", homeAddress: "", postalAddress: "", email: "", workCode: "",
          cell: "", preferredCallTime: "", dob: "", gender: "", nationality: "",
          bloodGroup: "", maritalStatus: "", durationOfStay: "", secondarySchool: "",
          graduation: "", postGraduation: "", otherQualifications: "", certifications: "",
          passportNumber: "", volunteerHours: "", workExperience: "", heardAbout: "",
          whyVolunteer: "", preferredArea: "", achievements: "", hobbies: "", about: "",
          emergencyName: "", emergencyNumber: ""
        });
        setPhoto(null); setIdentity(null);
      }
    } catch (err) {
      console.error(err);
      setError("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  const breadcrumbShadow = `0 10px 40px ${saffronMid}12, 0 6px 20px ${emeraldMid}0f`;
  const headerShadow = `0 18px 60px ${saffronMid}10, 0 8px 30px ${emeraldMid}0d`;
  const cardShadow = `0 28px 80px ${saffronMid}12, 0 8px 30px ${emeraldMid}08, inset 0 1px 0 #ffffff10`;

  const UploadButton = ({ id, label, accept, onChange }) => (
    <>
      <label
        htmlFor={id}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transform transition hover:-translate-y-0.5 active:scale-95"
        style={{
          background: GRAD_SOFT,
          color: "white",
          boxShadow: `0 8px 28px ${emeraldMid}14`
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90" aria-hidden>
          <path d="M12 3v12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 7l4-4 4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 21H4a1 1 0 0 1-1-1V7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-sm font-medium">{label}</span>
      </label>
      <input id={id} type="file" accept={accept} onChange={onChange} className="hidden" />
    </>
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: `linear-gradient(180deg, #f8fafc 0%, rgba(250,250,252,0.6) 40%, rgba(255,255,255,1) 100%)` }}
    >
      <section id="section-1" className="w-full">
        <TopCarousel />
      </section>

      <section id="section-2" className="bg-transparent">
        <div
          className="max-w-7xl  px-6 py-3 my-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.9)", boxShadow: breadcrumbShadow, backdropFilter: "saturate(120%) blur(6px)" }}
        >
          <div className="flex items-center justify-between">
            <nav className="text-sm text-gray-600">
              <a href="/" className="hover:underline">Home</a>
              <span className="mx-2 text-gray-300">›</span>
              <a href="/get-involved" className="hover:underline">Get Involved</a>
              <span className="mx-2 text-gray-300">›</span>
              <span className="font-medium text-gray-800">Volunteer</span>
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

        <main className="max-w-4xl mx-auto  mt-2 mb-16">
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
                Form to apply for a Volunteer in our NGO
              </h1>
              <p className="mt-2 text-sm text-gray-600">Join our volunteers team — fill the form below and attach the needed documents.</p>
            </div>
          </motion.header>

          <section className="mt-6 bg-white rounded-2xl p-6" style={{ boxShadow: cardShadow }}>
            <h2
              className="text-lg font-semibold mb-4 text-center"
              style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, WebkitBackgroundClip: "text", color: "transparent" }}
            >
              Volunteer Form
            </h2>

            {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>}

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name <span className="text-rose-500">*</span></label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Aman Verma" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Home Address</label>
                    <input name="homeAddress" value={form.homeAddress} onChange={handleChange} placeholder="123 Green Lane, Delhi" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Postal Address</label>
                    <input name="postalAddress" value={form.postalAddress} onChange={handleChange} placeholder="PO Box / ZIP" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email <span className="text-rose-500">*</span></label>
                    <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="aman@example.com" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Work Code</label>
                    <input name="workCode" value={form.workCode} onChange={handleChange} placeholder="WC-001" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cell Number <span className="text-rose-500">*</span></label>
                    <input name="cell" value={form.cell} onChange={handleChange} placeholder="+91 98765 43210" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">DOB</label>
                    <input name="dob" value={form.dob} onChange={handleChange} type="date" className="mt-1 w-full rounded-lg p-3 border border-gray-100" max={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <input name="gender" value={form.gender} onChange={handleChange} placeholder="Male / Female / Other" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nationality</label>
                    <input name="nationality" value={form.nationality} onChange={handleChange} placeholder="Indian" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Secondary School</label>
                    <input name="secondarySchool" value={form.secondarySchool} onChange={handleChange} placeholder="ABC Senior Secondary School" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Graduation / Post Grad</label>
                    <input name="graduation" value={form.graduation} onChange={handleChange} placeholder="B.A. / B.Sc. etc." className="mt-1 w-full rounded-lg p-3 border border-gray-100 mb-2" />
                    <input name="postGraduation" value={form.postGraduation} onChange={handleChange} placeholder="M.A. / M.Sc. etc." className="w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Other Qualifications / Certifications</label>
                  <input name="otherQualifications" value={form.otherQualifications} onChange={handleChange} placeholder="First Aid, Teaching Certificate" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Passport / Identity Number</label>
                    <input name="passportNumber" value={form.passportNumber} onChange={handleChange} placeholder="A1234567" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Volunteer Hours</label>
                    <input name="volunteerHours" value={form.volunteerHours} onChange={handleChange} placeholder="e.g., 10 hrs/week" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Work Experience</label>
                  <textarea name="workExperience" value={form.workExperience} onChange={handleChange} rows="3" placeholder="Previous roles, organisations" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">How did you hear about us?</label>
                    <input name="heardAbout" value={form.heardAbout} onChange={handleChange} placeholder="Friend / Social / Website" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Volunteer Area</label>
                    <input name="preferredArea" value={form.preferredArea} onChange={handleChange} placeholder="Education / Health / Outreach" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Why do you want to volunteer?</label>
                    <textarea name="whyVolunteer" value={form.whyVolunteer} onChange={handleChange} rows="3" placeholder="Tell us your motivation" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Achievements & Goals</label>
                    <textarea name="achievements" value={form.achievements} onChange={handleChange} rows="3" placeholder="Key achievements / goals" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hobbies</label>
                    <input name="hobbies" value={form.hobbies} onChange={handleChange} placeholder="Reading, Cycling, Music" className="mt-1 w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                    <input name="emergencyName" value={form.emergencyName} onChange={handleChange} placeholder="Name" className="mt-1 w-full rounded-lg p-3 border border-gray-100 mb-2" />
                    <input name="emergencyNumber" value={form.emergencyNumber} onChange={handleChange} placeholder="+91 98xxxxxxx" className="w-full rounded-lg p-3 border border-gray-100" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Volunteer Photo</label>
                    <div className="mt-2 flex items-center gap-3">
                      <UploadButton
                        id="photo"
                        label={photo ? "Change Photo" : "Upload Photo"}
                        accept="image/*"
                        onChange={(e)=>handleFile(setPhoto, e)}
                      />
                      {photoPreview ? (
                        <div className="relative w-24 h-24 rounded-md overflow-hidden shadow-md" title={photo.name}>
                          <img src={photoPreview} alt="photo preview" className="object-cover w-full h-full" />
                          <button
                            type="button"
                            onClick={() => setPhoto(null)}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-xs"
                            aria-label="Remove photo"
                          >✕</button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No photo selected</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Identity Proof (passport / id)</label>
                    <div className="mt-2 flex items-center gap-3">
                      <UploadButton
                        id="identity"
                        label={identity ? "Change Document" : "Upload Document"}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e)=>handleFile(setIdentity, e)}
                      />
                      {identity ? (
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md flex items-center justify-center bg-gray-50 border">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 3v12" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 7l4-4 4 4" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{identity.name}</div>
                            <div className="text-xs text-gray-500">{(identity.size/1024).toFixed(0)} KB</div>
                          </div>
                          <button type="button" onClick={() => setIdentity(null)} className="ml-3 text-sm text-rose-600">Remove</button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No document selected</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-500"><span className="text-rose-500">*</span> Required fields</div>

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
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>

                    <button type="button" onClick={() => { setForm({
                      name: "", homeAddress: "", postalAddress: "", email: "", workCode: "",
                      cell: "", preferredCallTime: "", dob: "", gender: "", nationality: "",
                      bloodGroup: "", maritalStatus: "", durationOfStay: "", secondarySchool: "",
                      graduation: "", postGraduation: "", otherQualifications: "", certifications: "",
                      passportNumber: "", volunteerHours: "", workExperience: "", heardAbout: "",
                      whyVolunteer: "", preferredArea: "", achievements: "", hobbies: "", about: "",
                      emergencyName: "", emergencyNumber: ""
                    }); setPhoto(null); setIdentity(null); setError(""); }} className="px-4 py-2 rounded-lg border">Reset</button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-6 bg-green-50 rounded-lg">
                <h2 className="text-lg font-semibold">Thank you!</h2>
                <p className="mt-2">We received your volunteer application.</p>
                {success?.referenceId && <p className="mt-2 text-sm text-gray-600">Reference ID: <strong>{success.referenceId}</strong></p>}
                {success?.message && <p className="mt-2 text-sm text-gray-600">{success.message}</p>}
                <div className="mt-4">
                  <button onClick={()=>setSuccess(null)} className="px-3 py-2 rounded-lg" style={{ background: `linear-gradient(90deg, ${saffronMid}, ${emeraldMid})`, color: "white" }}>Submit another</button>
                </div>
              </div>
            )}
          </section>
        </main>
      </section>
    </div>
  );
}
