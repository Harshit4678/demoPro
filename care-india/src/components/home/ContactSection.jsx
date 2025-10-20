// components/ContactSection.jsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowRight, ShieldCheck, Send, Sparkles } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

/**
 * ContactSection — now theme-controlled via useThemeStore()
 * Replaces local BRAND with CSS variables from the store:
 *  --saffron, --saffron-soft, --emerald, --emerald-soft, --grad, --ink
 *
 * Sensible fallbacks are provided when store values are missing.
 */

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    pincode: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, ok: false, error: "" });

  // theme from store
  const {
    saffronMid,
    saffronSoft,
    emeraldMid,
    emeraldSoft,
    grad,
    gradSoft,
    ink,
    ctaScale,
  } = useThemeStore();

  // sensible fallbacks
  const saffron = saffronMid ?? "#FF8C1A";
  const saffronS = saffronSoft ?? `${saffron}66`;
  const emerald = emeraldMid ?? "#0EA765";
  const emeraldS = emeraldSoft ?? `${emerald}33`;
  const GRAD = grad ?? `linear-gradient(90deg, ${saffron}, ${emerald})`;
  const GRAD_SOFT = gradSoft ?? `linear-gradient(135deg, ${saffronS}, ${emeraldS})`;
  const inkColor = ink ?? "#0f172a";
  const ctaScaleVal = typeof ctaScale === "number" ? ctaScale : 1.02;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, ok: false, error: "" });

    try {
      // fake network delay to simulate submit
      await new Promise((r) => setTimeout(r, 900));
      setStatus({ loading: false, ok: true, error: "" });
      setForm({ name: "", address: "", pincode: "", phone: "", email: "", message: "" });
    } catch (err) {
      setStatus({ loading: false, ok: false, error: "Something went wrong. Please try again." });
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      style={{
        // expose store colors as CSS variables for children
        ["--saffron"]: saffron,
        ["--saffron-soft"]: saffronS,
        ["--emerald"]: emerald,
        ["--emerald-soft"]: emeraldS,
        ["--grad"]: GRAD,
        ["--grad-soft"]: GRAD_SOFT,
        ["--ink"]: inkColor,
        ["--cta-scale"]: ctaScaleVal,
      }}
    >
      {/* Subtle brand background accents (lighter, smaller) */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-20 -left-20 h-[28rem] w-[28rem] rounded-full blur-2xl opacity-20"
          style={{ background: `radial-gradient(closest-side, color-mix(in oklab, var(--saffron) 70%, white), transparent)` }}
        />
        <div
          className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-2xl opacity-20"
          style={{ background: `radial-gradient(closest-side, color-mix(in oklab, var(--emerald) 70%, white), transparent)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.25) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-14 md:grid-cols-2 md:gap-8 lg:px-6">
        {/* Left: Headline + Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-wide"
            style={{
              border: `1px solid ${emerald}33`,
              background: `color-mix(in oklab, var(--emerald) 6%, transparent)`,
              color: emerald,
            }}
          >
            <Sparkles className="h-4 w-4" />
            <span>We respond within 24 hours</span>
          </div>

          <h2 className="text-balance text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
            Get in Touch:{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, var(--saffron), var(--emerald))` }}
            >
              Let's Make a Difference Together!
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-base leading-7" style={{ color: "var(--ink)" }}>
            Every message and contribution counts. Reach out to us — we’ll get back to you soon and work together to create lasting impact.
          </p>

          <div className="mt-5 h-px w-20" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.12), transparent)" }} />

          <div className="mt-5 flex flex-col gap-3" style={{ color: "var(--ink)" }}>
            <a
              href="mailto:info@careindiawelfaretrust.org"
              className="group inline-flex items-start gap-3 rounded-xl p-2 transition hover:bg-black/5"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-black/5">
                <Mail className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-wider text-neutral-500">Email</span>
                <span className="block select-all text-base font-semibold">info@careindiawelfaretrust.org</span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
            </a>

            <a
              href="tel:18003134006"
              className="group inline-flex items-start gap-3 rounded-xl p-2 transition hover:bg-black/5"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-black/5">
                <Phone className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-wider text-neutral-500">Phone</span>
                <span className="block select-all text-base font-semibold">1800 313 4006</span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
            </a>

            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="h-4 w-4" />
              <span>Your privacy is our priority. We never share your details.</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Compact Contact Card Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          className="relative"
        >
          <div
            className="absolute -inset-px rounded-2xl blur"
            style={{
              backgroundImage: `linear-gradient(135deg, color-mix(in oklab, var(--saffron) 40%, white), color-mix(in oklab, var(--emerald) 22%, white))`,
            }}
          />
          <div className="relative rounded-2xl border border-black/10 bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Send us a message</h3>
              <p className="mt-1 text-sm text-neutral-600">Fill out the form below and we’ll reach out shortly.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Name" id="name" name="name" value={form.name} onChange={handleChange} autoComplete="name" required placeholder="Your full name" />
                <Field label="Pincode" id="pincode" name="pincode" value={form.pincode} onChange={handleChange} inputMode="numeric" pattern="^[0-9]{6}$" placeholder="6-digit pincode" required />
              </div>

              <Field label="Address" id="address" name="address" value={form.address} onChange={handleChange} autoComplete="street-address" placeholder="House/Street, City, State" required />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Phone" id="phone" name="phone" value={form.phone} onChange={handleChange} inputMode="tel" pattern="^[0-9\-\+\s]{10,15}$" autoComplete="tel" placeholder="e.g. 9876543210" required />
                <Field label="Email" id="email" name="email" value={form.email} onChange={handleChange} type="email" autoComplete="email" placeholder="you@example.com" required />
              </div>

              <FieldTextArea label="Message" id="message" name="message" value={form.message} onChange={handleChange} placeholder="Write your message here..." rows={4} required />

              <div className="mt-1 flex items-center justify-between gap-3">
                <div className="text-xs text-neutral-500">By submitting, you agree to be contacted regarding your inquiry.</div>
                <button
                  type="submit"
                  disabled={status.loading}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    backgroundImage: `linear-gradient(90deg, var(--saffron), var(--emerald))`,
                    transform: `scale(${status.loading ? 0.98 : "var(--cta-scale)"})`,
                    willChange: "transform, box-shadow",
                  }}
                >
                  {status.loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>

              {status.ok && (
                <div
                  className="mt-3 rounded-lg p-3 text-sm"
                  style={{
                    border: `1px solid ${emerald}33`,
                    background: `color-mix(in oklab, var(--emerald) 6%, white)`,
                    color: emerald,
                  }}
                >
                  Thank you! Your message has been sent. We'll be in touch soon.
                </div>
              )}
              {status.error && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {status.error}
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ----------------------
   Helper form fields
   ---------------------- */

function Field({ label, id, name, value, onChange, placeholder, type = "text", required, autoComplete, inputMode, pattern }) {
  return (
    <label htmlFor={id} className="grid gap-1 text-sm">
      <span className="text-[var(--ink)]">{label}</span>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        className="peer w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[var(--ink)] placeholder:text-neutral-400 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-[color-mix(in oklab,var(--emerald) 12%, transparent)]"
      />
      {pattern && (
        <span className="hidden text-xs text-red-600 peer-[&:not(:placeholder-shown):invalid]:block">
          Invalid format.
        </span>
      )}
    </label>
  );
}

function FieldTextArea({ label, id, name, value, onChange, placeholder, rows = 4, required }) {
  return (
    <label htmlFor={id} className="grid gap-1 text-sm">
      <span className="text-[var(--ink)]">{label}</span>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full resize-y rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[var(--ink)] placeholder:text-neutral-400 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-[color-mix(in oklab,var(--emerald) 12%, transparent)]"
      />
    </label>
  );
}
