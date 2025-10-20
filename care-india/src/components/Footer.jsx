// components/Footer.jsx
"use client";

import React from "react";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import Link from "next/link";
import { useThemeStore } from "@/stores/themeStore";

/**
 * Theme-aware Footer
 * - Reads colors from themeStore: saffronMid, saffronSoft, emeraldMid, emeraldSoft, grad, ink
 * - Exposes CSS variables so other components can reuse the same palette
 * - Sensible fallbacks included
 */

export default function Footer() {
  const {
    saffronMid,
    saffronSoft,
    emeraldMid,
    emeraldSoft,
    grad,
    gradSoft,
    ink,
  } = useThemeStore();

  const saffron = saffronMid ?? "#FF8C1A";
  const saffronS = saffronSoft ?? `${saffron}66`;
  const emerald = emeraldMid ?? "#0EA765";
  const emeraldS = emeraldSoft ?? `${emerald}33`;
  const GRAD = grad ?? `linear-gradient(135deg, ${saffron}, ${emerald})`;
  const GRAD_SOFT = gradSoft ?? `linear-gradient(135deg, ${saffronS}, ${emeraldS})`;
  const inkColor = ink ?? "#0f172a";

  return (
    <footer
      className="text-white"
      style={{
        // expose variables for nested components
        ["--saffron"]: saffron,
        ["--saffron-soft"]: saffronS,
        ["--emerald"]: emerald,
        ["--emerald-soft"]: emeraldS,
        ["--grad"]: GRAD,
        ["--grad-soft"]: GRAD_SOFT,
        ["--ink"]: inkColor,
        backgroundImage: `linear-gradient(135deg, var(--saffron), var(--emerald))`,
      }}
    >
      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-6 py-14 text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">
          Be the change you wish to see in the world.
        </h2>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-full bg-white/90 px-6 py-2 text-sm font-semibold text-neutral-800 shadow-md transition hover:bg-white"
        >
          Get Started
        </Link>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-white/30" />

      {/* Footer Main Content */}
      <div className="mx-auto grid max-w-8xl grid-cols-1 gap-10 px-10 py-14 md:grid-cols-6 items-stretch md:min-h-[380px]">
        {/* Left Column — Wider + Perfect Center */}
        <div className="md:col-span-2 h-full self-stretch flex flex-col items-center justify-center text-center px-6 py-6">
          <img src="/logo.ico" alt="Care India Logo" className="mb-4 h-28 w-auto" />
          <p className="text-xl mb-4 font-medium text-white/90">Subscribe to our newsletter</p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-xs items-center overflow-hidden rounded-full bg-white/90 shadow-md focus-within:shadow-lg transition"
            role="search"
            aria-label="Subscribe to newsletter"
          >
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="flex-1 px-4 py-2 text-sm text-neutral-700 outline-none bg-transparent placeholder:text-neutral-500"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--saffron)] to-[var(--emerald)] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_12px_rgba(14,167,101,0.5)]"
            >
              <span className="relative z-10">Subscribe</span>
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--saffron)] to-[var(--emerald)] opacity-0 blur-md group-hover:opacity-40 transition duration-300" />
            </button>
          </form>
        </div>

        {/* Right Columns — Remaining width */}
        <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <FooterColumn
            title="Our Work"
            links={["Education", "Health", "Livelihood", "Old Age Assistance", "Women Empowerment"]}
          />
          <FooterColumn title="Achievements" links={["Awards", "Impacts", "Campaigns"]} />
          <FooterColumn title="Our Financials" links={["Financial Statements", "Annual Reports", "Legal Documents"]} />
          <FooterColumn title="Help" links={["FAQs", "Contact Us", "Locate Us"]} />
        </div>
      </div>

      {/* Lower Divider */}
      <div className="h-px w-full bg-white/30" />

      {/* Footer Bottom */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-white/90 underline-offset-4">
          <Link href="#" className="hover:underline">Privacy Policy</Link>
          <Link href="#" className="hover:underline">Refund & Cancellation Policy</Link>
          <Link href="#" className="hover:underline">Contact Us</Link>
          <Link href="#" className="hover:underline">Terms & Conditions</Link>
        </div>

        {/* Social Icons */}
        <div className="mt-6 flex justify-center gap-5">
          <SocialIcon Icon={Facebook} href="#" />
          <SocialIcon Icon={Twitter} href="#" />
          <SocialIcon Icon={Youtube} href="#" />
          <SocialIcon Icon={Instagram} href="#" />
        </div>

        {/* Copyright */}
        <p className="mt-6 text-center text-xs text-white/80">
          © {new Date().getFullYear()} Care India Welfare Trust. All rights reserved.
        </p>
      </div>

      <style jsx>{`
        footer a { color: inherit; }
        /* ensure gradient buttons read CSS var */
        .from-\\[var\\(--saffron\\)] { --tw-gradient-from: var(--saffron); }
        .to-\\[var\\(--emerald\\)] { --tw-gradient-to: var(--emerald); }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </footer>
  );
}

/* ---------------------- Helpers ---------------------- */

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">{title}</h3>
      <ul className="space-y-2 text-sm text-white/85">
        {links.map((link, i) => (
          <li key={i}>
            <a href="#" className="hover:underline">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ Icon, href }) {
  return (
    <a
      href={href}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white hover:text-[var(--emerald)]"
      aria-label="social"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
