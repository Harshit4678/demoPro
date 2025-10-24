// components/Header.jsx
"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import AnimatedLogo from "./AnimatedLogo";
import { createPortal } from "react-dom";
import { useThemeStore } from "@/stores/themeStore"; // adjust path if needed

// MENU kept static here
const MENU = [
  {
    label: "Who we are",
    href: "/who-we-are",
    items: [
      { label: "About us", href: "/who-we-are/about" },
      { label: "How we work", href: "/who-we-are/how-we-work" },
      { label: "Vision & Mission", href: "/who-we-are/vision-mission" },
    ],
  },
  {
    label: "Get involved",
    href: "/get-involved",
    items: [
      { label: "Career", href: "/get-involved/career" },
      { label: "Internship", href: "/get-involved/internship" },
      { label: "Volunteer", href: "/get-involved/volunteer" },
      { label: "NGO", href: "/get-involved/ngo" },
      { label: "CSR Collaboration", href: "/get-involved/csr" },
      { label: "Corporate Engagements", href: "/get-involved/corporate" },
    ],
  },
  {
    label: "Our work",
    href: "/our-work",
    items: [
      { label: "Child Sponsorship", href: "/cases" },
      { label: "Education", href: "/our-work/education" },
      { label: "Health", href: "/our-work/health" },
      { label: "Livelihood", href: "/our-work/livelihood" },
      { label: "Old Age Assistance", href: "/our-work/old-age-assistance" },
      { label: "Women Empowerment", href: "/our-work/women-empowerment" },
    ],
  },
  {
    label: "Achievements",
    href: "/achievements",
    items: [
      { label: "Awards", href: "/achievements/awards" },
      { label: "Impacts", href: "/achievements/impacts" },
      { label: "Campaigns", href: "/achievements/campaigns" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    items: [
      { label: "Blog", href: "/resources/blog" },
      { label: "Events", href: "/resources/events" },
      { label: "News", href: "/resources/news" },
      { label: "Photo Gallery", href: "/resources/gallery" },
      { label: "Insights", href: "/resources/insights" },
    ],
  },
];

function usePortalRoot(id = "mobile-menu-portal") {
  const elRef = useRef(null);
  useEffect(() => {
    let root = document.getElementById(id);
    let created = false;
    if (!root) {
      root = document.createElement("div");
      root.id = id;
      document.body.appendChild(root);
      created = true;
    }
    elRef.current = root;
    return () => {
      if (created && root.parentNode) root.parentNode.removeChild(root);
    };
  }, [id]);
  return elRef.current;
}

export default function Header() {
  const saffronMid = useThemeStore((s) => s.saffronMid);
  const GRAD = useThemeStore((s) => s.GRAD);
  const GRAD_SOFT = useThemeStore((s) => s.GRAD_SOFT);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAcc, setOpenAcc] = useState({});
  const [openMenu, setOpenMenu] = useState(null);
  const blurTimeoutRef = useRef(null);
  const portalRoot = usePortalRoot();

  // IMPORTANT: mounted flag — render full menu only on client after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      const prevTouch = document.body.style.touchAction;
      const prevObs = document.body.style.overscrollBehavior;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.body.style.overscrollBehavior = "contain";
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.touchAction = prevTouch;
        document.body.style.overscrollBehavior = prevObs;
      };
    }
  }, [open]);

  const toggleAcc = (key) => setOpenAcc((p) => ({ ...p, [key]: !p[key] }));
  const openMenuNow = (label) => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = null;
    setOpenMenu(label);
  };
  const closeMenuLater = () => {
    blurTimeoutRef.current = setTimeout(() => setOpenMenu(null), 120);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpenMenu(null);
      setOpen(false);
    }
  };

  const textColor = scrolled ? "text-white" : "text-gray-900";
  const menuItemBtnText = scrolled ? "text-white" : "text-gray-900";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[5000] transition-colors duration-300 ${scrolled ? "shadow-md backdrop-blur" : ""}`}
      role="navigation"
      aria-label="Primary"
      onKeyDown={handleKeyDown}
      style={scrolled ? { background: GRAD_SOFT } : { background: "transparent" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between pt-4 sm:pt-6 relative">
          <div className="relative flex items-center" style={{ zIndex: 5100 }}>
            <AnimatedLogo />
          </div>

          {/* Desktop nav: render only after mount to avoid SSR/CSR mismatch */}
          <nav className="hidden md:flex items-center gap-2" role="menubar">
            {mounted ? (
              MENU.map((m) => {
                const isOpen = openMenu === m.label;
                const hasChildren = !!(m.items && m.items.length);
                return (
                  <div
                    key={m.label}
                    className="relative"
                    onMouseEnter={() => hasChildren && openMenuNow(m.label)}
                    onMouseLeave={() => hasChildren && closeMenuLater()}
                    onFocus={() => hasChildren && openMenuNow(m.label)}
                    onBlur={() => hasChildren && closeMenuLater()}
                    tabIndex={-1}
                    aria-haspopup={hasChildren ? "true" : undefined}
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        className={`inline-block px-3 py-2 rounded-lg text-xm md:text-xm font-extrabold ${menuItemBtnText}`}
                        aria-expanded={isOpen}
                        onClick={() => {
                          setOpenMenu((prev) => (prev === m.label ? null : m.label));
                        }}
                      >
                        <span className="inline-block px-2 py-1 rounded-md">{m.label}</span>
                      </button>
                    ) : (
                      <Link
                        href={m.href}
                        className={`inline-block px-3 py-2 rounded-lg text-sm font-medium ${textColor}`}
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                      >
                        <span className="inline-block px-2 py-1 rounded-md">{m.label}</span>
                      </Link>
                    )}

                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-0 top-0 h-8 w-full rounded-lg opacity-0 transition-opacity"
                      style={{
                        boxShadow: isOpen ? `0 0 0 2px ${saffronMid} inset, 0 0 12px ${saffronMid}55` : "none",
                        opacity: isOpen ? 1 : 0,
                        transitionDuration: "150ms",
                      }}
                    />

                    {hasChildren && (
                      <div
                        role="menu"
                        aria-label={`${m.label} submenu`}
                        className="absolute left-0 top-full mt-1 w-64 rounded-xl border bg-white/95 shadow-lg backdrop-blur z-[5200] transform transition-all duration-150"
                        style={{
                          opacity: isOpen ? 1 : 0,
                          transform: isOpen ? "translateY(0)" : "translateY(-6px)",
                          pointerEvents: isOpen ? "auto" : "none",
                        }}
                      >
                        <ul className="py-2">
                          {m.items.map((it) => (
                            <li key={it.label}>
                              <Link
                                href={it.href}
                                className="block px-4 py-2 text-sm text-gray-800 rounded-md mx-1 grad-hover"
                                role="menuitem"
                                onClick={() => setOpenMenu(null)}
                              >
                                {it.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // server-rendered placeholder to keep SSR output stable
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 text-sm text-gray-500">Menu</span>
              </div>
            )}

            <Link
              href="/donate"
              className={`ml-3 rounded px-4 py-2 text-sm font-extrabold shadow transition  bg-white/70 hover:scale-110 hover:shadow-yellow-200 hover:bg-amber-200/60  mb-2`}
            >
              <span className="text-xl">❤️</span> DONATE NOW
            </Link>
          </nav>

          <button
            className={`md:hidden inline-flex items-center gap-2 rounded-sm px-3 py-2 mb-2 outline-none ring-0 border ${scrolled ? "border-white/40 bg-white/10 text-white" : "border-gray-300 bg-transparent text-gray-900"}`}
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18M3 12h14M3 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {!scrolled && (
        <div
          aria-hidden
          className="absolute left-[7.25rem] right-8 bottom-0 h-[2px] z-[5050] pointer-events-none transition-all duration-200"
          style={{ backgroundColor: "rgba(255,179,71,0.45)" }}
        />
      )}

      {/* Mobile panel rendered only when mounted & open to avoid SSR mismatch */}
      {mounted && open && portalRoot &&
        createPortal(
          <div className="md:hidden fixed inset-0 z-[99999]" aria-modal="true" role="dialog">
            <div className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} />

            <div
              className="absolute right-0 top-0 h-full w-80 max-w-[92%] p-4 overflow-y-auto"
              style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
            >
              <div className="h-full flex flex-col gap-4">
                <div className="flex items-center bg-gradient-to-r from-amber-600/90 to-emerald-700/80 rounded-xl py-2 px-4 shadow-neutral-300/50">
                  <img
                    src="/logo.ico"
                    alt="Care India Welfare Trust Logo"
                    className="w-10 h-10 object-contain rounded-md"
                  />
                  <span className="font-medium text-[12px] text-white w-[50%] pl-2 rounded flex justify-center">Care India Welfare Trust</span>
                  <button aria-label="Close menu" className="p-2 rounded-full hover:bg-gray-100 transition ml-[20%]" onClick={() => setOpen(false)}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <nav className="space-y-3">
                  {MENU.map((m) => {
                    const isOpenAcc = !!openAcc[m.label];
                    return (
                      <div key={m.label} className="bg-white/95 rounded-xl p-2 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            className="flex-1 text-left px-3 py-3 rounded-md font-medium text-gray-900 flex items-center justify-between gap-3"
                            onClick={() => toggleAcc(m.label)}
                            aria-expanded={isOpenAcc}
                            aria-controls={`sec-${m.label}`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="w-2 h-2 rounded-full" style={{ background: saffronMid }} />
                              <span>{m.label}</span>
                            </span>
                            <span className={`transform transition-transform duration-200 ${isOpenAcc ? "rotate-180" : ""}`}>▾</span>
                          </button>
                        </div>

                        <div
                          id={`sec-${m.label}`}
                          className={`mt-2 grid gap-2 px-2 pb-2 transition-[max-height] duration-250 overflow-hidden ${isOpenAcc ? "max-h-96" : "max-h-0"}`}
                          aria-hidden={!isOpenAcc}
                        >
                          {m.items?.map((it) => (
                            <Link
                              key={it.label}
                              href={it.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm font-medium grad-menu-item transition"
                            >
                              {it.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-2">
                    <Link
                      href="/donate"
                      onClick={() => setOpen(false)}
                      className="block w-full text-center rounded-xl px-4 py-3 font-semibold grad-btn bg-gradient-to-r from-amber-600/60 to-emerald-700/50 text-white shadow-lg hover:scale-90 transition hover:shadow-yellow-200"
                    >
                      <span className="text-2xl">❤️</span> Donate Now
                    </Link>
                  </div>
                </nav>

                <div className="mt-auto text-xs text-gray-500">
                  <p>© {new Date().getFullYear()} Care India — All rights reserved</p>
                </div>
              </div>
            </div>
          </div>,
          portalRoot
        )
      }

      <style jsx>{`
        .grad-btn {
          background: ${GRAD};
          color: #07122d;
          border: 2px solid ${saffronMid};
        }
        .grad-btn:hover {
          filter: brightness(1.02);
          box-shadow: 0 12px 30px ${saffronMid}33;
          background: linear-gradient(135deg, ${saffronMid}, ${saffronMid}AA 80%);
          color: #fff !important;
        }

        .grad-btn-small {
          background: linear-gradient(90deg, ${saffronMid}, ${saffronMid}CC);
          color: white;
          border-radius: 8px;
          padding: 8px 10px;
        }

        .grad-hover:hover {
          background: linear-gradient(135deg, ${saffronMid}, ${saffronMid}AA 80%);
          color: #fff !important;
        }

        .grad-menu-item {
          background: linear-gradient(90deg, rgba(255,255,255,0.0), rgba(255,255,255,0.0));
          color: #07122d;
          border-radius: 10px;
          padding-left: 12px;
          padding-right: 12px;
          padding-top: 10px;
          padding-bottom: 10px;
          display: block;
        }
        .grad-menu-item:hover {
          background: linear-gradient(90deg, ${saffronMid}11, ${saffronMid}22);
          box-shadow: 0 8px 22px ${saffronMid}22;
          color: #07122d;
        }

        @media (max-width: 768px) {
          .grad-btn, .grad-btn-small { box-shadow: 0 10px 26px ${saffronMid}22; }
        }
      `}</style>
    </header>
  );
}
