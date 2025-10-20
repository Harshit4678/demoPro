// components/FloatingPartnerBubbles.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useThemeStore } from "@/stores/themeStore";

/**
 * FloatingPartnerBubbles — Tailwind + themeStore version
 * NOTE: fixed Zustand selector to avoid "getSnapshot should be cached" infinite loop.
 */

const LOGOS = [
  "/images/ourPartners/p1.png",
  "/images/ourPartners/p2.jpg",
  "/images/ourPartners/p3.jpg",
  "/images/ourPartners/p4.jpg",
  "/images/ourPartners/p5.png",
  "/images/ourPartners/p6.png",
  "/images/ourPartners/p7.png",
  "/images/ourPartners/p8.png",
  "/images/ourPartners/p9.jpg",
  "/images/ourPartners/p10.jpg",
  "/images/ourPartners/p11.jpg",
  "/images/ourPartners/p12.jpg",
  "/images/ourPartners/p13.jpg",
  "/images/ourPartners/p14.jpg",
  "/images/ourPartners/p15.png",
  "/images/ourPartners/p16.jpg",
  "/images/ourPartners/p17.jpg",
  "/images/ourPartners/p18.png",
  "/images/ourPartners/p19.jpg",
  "/images/ourPartners/p20.jpg",
  "/images/ourPartners/p21.jpg",
  "/images/ourPartners/p22.png",
];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* -------- Bubble component (Tailwindified) -------- */
function Bubble({ id, logo, size = 110, initial, containerRef, onActivate, zIndex, theme }) {
  const elRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particleRAF = useRef(null);
  const particlesRef = useRef([]);
  const posRef = useRef({ x: initial.left, y: initial.top, vx: initial.vx, vy: initial.vy });
  const boundsRef = useRef({ w: 0, h: 0 });
  const [mode, setMode] = useState("sphere"); // sphere | exploding | revealed | assembling
  const prefersReduceRef = useRef(false);


  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      prefersReduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const container = containerRef.current;
    if (!container) return;
    const onResize = () => {
      const r = container.getBoundingClientRect();
      boundsRef.current = { w: r.width, h: r.height };
      posRef.current.x = Math.min(Math.max(0, posRef.current.x), Math.max(0, r.width - size));
      posRef.current.y = Math.min(Math.max(0, posRef.current.y), Math.max(0, r.height - size));
      applyTransform();
    };
    onResize();
    window.addEventListener("resize", onResize);
    startMotion();
    return () => {
      window.removeEventListener("resize", onResize);
      stopMotion();
      stopParticles();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTransform = () => {
    const el = elRef.current;
    if (el) {
      const { x, y } = posRef.current;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  };

  const startMotion = () => {
    if (prefersReduceRef.current) return;
    if (animRef.current) return;
    let last = performance.now();
    const loop = (t) => {
      const dt = Math.min(40, t - last) / 1000;
      last = t;
      const p = posRef.current;
      const b = boundsRef.current;
      // gentle wiggle
      p.vx += Math.sin(t / 1200 + id) * 12 * dt;
      p.vy += Math.cos(t / 900 + id) * 8 * dt;
      // move
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      // bounds & bounce
      const maxX = Math.max(0, b.w - size);
      const maxY = Math.max(0, b.h - size);
      if (p.x < 0) { p.x = 0; p.vx *= -0.78; p.vy *= 0.98; }
      if (p.x > maxX) { p.x = maxX; p.vx *= -0.78; p.vy *= 0.98; }
      if (p.y < 0) { p.y = 0; p.vy *= -0.78; p.vx *= 0.98; }
      if (p.y > maxY) { p.y = maxY; p.vy *= -0.78; p.vx *= 0.98; }
      applyTransform();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  };

  const stopMotion = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = null;
  };

  /* ---------------- Particles (canvas) ---------------- */
  const createParticles = (count) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cw = canvas.clientWidth || size;
    const ch = canvas.clientHeight || size;
    canvas.width = cw * devicePixelRatio;
    canvas.height = ch * devicePixelRatio;
    const cx = cw / 2;
    const cy = ch / 2;
    particlesRef.current = [];
    for (let i = 0; i < count; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(60, 320);
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: rand(1.5, 5),
        life: rand(0.8, 1.6),
        age: 0,
        alpha: 1,
      });
    }
  };

  const startParticles = (direction = "out") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    createParticles(Math.min(36, Math.round(size / 3)));
    if (particleRAF.current) cancelAnimationFrame(particleRAF.current);
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(40, now - last) / 1000;
      last = now;
      updateParticles(dt, direction);
      particleRAF.current = requestAnimationFrame(loop);
    };
    particleRAF.current = requestAnimationFrame(loop);
  };

  const stopParticles = () => {
    if (particleRAF.current) cancelAnimationFrame(particleRAF.current);
    particleRAF.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    particlesRef.current = [];
  };

  const updateParticles = (dt, direction) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    for (let p of particlesRef.current) {
      if (direction === "out") {
        p.age += dt;
        p.vx *= 0.995;
        p.vy = p.vy * 0.995 + 60 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const t = Math.min(1, p.age / p.life);
        p.alpha = Math.max(0, 1 - t);
      } else {
        const cx = W / 2, cy = H / 2;
        p.vx += (cx - p.x) * 6 * dt;
        p.vy += (cy - p.y) * 6 * dt;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha = Math.min(1, p.alpha + dt * 3);
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha * 0.95})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  /* ---------------- Interactions ---------------- */
  const doActivate = () => {
    onActivate && onActivate(id);
    if (mode !== "sphere") return;
    setMode("exploding");
    stopMotion();
    startParticles("out");
    setTimeout(() => {
      setMode("revealed");
      setTimeout(() => stopParticles(), 500);
    }, 220);
  };

  const doDeactivate = () => {
    if (mode !== "revealed") return;
    setMode("assembling");
    startParticles("in");
    setTimeout(() => {
      stopParticles();
      setMode("sphere");
      setTimeout(() => startMotion(), 160);
    }, 560);
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    doActivate();
  };
  const onPointerUp = (e) => {
    e.preventDefault();
    if (mode === "revealed") doDeactivate();
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (mode === "sphere") doActivate();
      else if (mode === "revealed") doDeactivate();
    }
  };

  const wrapperStyle = {
    width: `${size}px`,
    height: `${size}px`,
    position: "absolute",
    borderRadius: "999px",
    zIndex: zIndex ?? 100,
    touchAction: "manipulation",
    cursor: "pointer",
    transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`,
  };

  return (
    <div
      ref={elRef}
      style={wrapperStyle}
      className="focus:outline-none"
      tabIndex={0}
      role="button"
      aria-label={`Partner bubble ${id + 1}`}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
      onMouseUp={onPointerUp}
      onTouchEnd={onPointerUp}
      onKeyDown={onKeyDown}
    >
      {/* sphere */}
      <div
        className={`relative w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-transform duration-300`}
        style={{
          boxShadow: mode === "sphere" ? "inset -8px -10px 26px rgba(255,255,255,0.32), 0 10px 30px rgba(0,0,0,0.12)" : "none",
          background: `radial-gradient(120% 120% at 35% 30%, rgba(255,255,255,0.75), rgba(255,255,255,0.12))`,
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: theme?.GRAD || undefined,
            opacity: 0.18,
            mixBlendMode: "overlay",
          }}
          aria-hidden
        />
        <img
          src={logo}
          alt={`Partner ${id + 1}`}
          className="w-2/3 h-2/3 object-contain pointer-events-none select-none"
          draggable={false}
        />
      </div>

      {/* revealed card */}
<div
  className={`absolute -left-2 -top-2 w-[calc(100%+16px)] h-[calc(100%+16px)] rounded-xl p-2 flex items-center justify-center text-center transition-opacity duration-220 ${
    mode === "revealed" || mode === "assembling"
      ? "opacity-100"
      : "opacity-0 pointer-events-none"
  }`}
  style={{
    background: "linear-gradient(135deg, #fffdf7, #fffbea)", // lighter cream bg
    boxShadow: `
      0 0 12px 2px rgba(255,153,51,0.35),   /* saffron */
      0 0 18px 4px rgba(16,185,129,0.28),   /* emerald */
    
      0 0 30px 8px rgba(255,253,245,0.2),   /* cream-white */
      0 8px 22px rgba(0,0,0,0.08)            /* base subtle shadow */
    `,
  }}
>
  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
    <img src={logo} alt="" className="w-2/3 h-2/3 object-contain" />
    <div className="text-xs text-slate-600">Tap again to close</div>
  </div>
</div>


      {/* particle canvas */}
      <canvas
        ref={canvasRef}
        className={`${mode === "sphere" ? "hidden" : "block"} absolute left-0 top-0 w-full h-full pointer-events-none`}
        style={{ borderRadius: "999px" }}
      />
    </div>
  );
}

/* -------- Parent container (Tailwind + theme) -------- */
export default function OurPartners() {
  const containerRef = useRef(null);
  const [bubbles, setBubbles] = useState([]);
  const zCounterRef = useRef(1000); // will increment for bring-to-front
  const zMapRef = useRef({}); // id -> zIndex
  const [, setTick] = useState(0);

  // ---------- IMPORTANT: use separate selectors to avoid returning a new object each render ----------
  const GRAD = useThemeStore((s) => s.GRAD);
  const GRAD_SOFT = useThemeStore((s) => s.GRAD_SOFT);
  const saffron = useThemeStore((s) => s.saffronMid);
  const emerald = useThemeStore((s) => s.emeraldMid);
  const theme = { GRAD, GRAD_SOFT, saffron, emerald };
  // -----------------------------------------------------------------------------------------------

  useEffect(() => {
    const init = () => {
      const c = containerRef.current;
      const w = c?.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 1024);
      const h = c?.clientHeight || (typeof window !== "undefined" ? window.innerHeight : 768);
      const arr = LOGOS.map((logo, i) => {
        const size = 80 + Math.floor(Math.random() * 70); // 80..150
        const left = Math.round((Math.random() * 0.75 + 0.1) * (w - size));
        const top = Math.round((Math.random() * 0.75 + 0.06) * (h - size));
        const vx = rand(-80, 80);
        const vy = rand(-60, 60);
        zMapRef.current[i] = 100 + i; // baseline z
        return { logo, size, left, top, vx, vy, id: i };
      });
      setBubbles(arr);
      setTick((t) => t + 1);
    };
    init();
    window.addEventListener("resize", init);
    return () => window.removeEventListener("resize", init);
  }, []);

  const bringToFront = (id) => {
    zMapRef.current[id] = ++zCounterRef.current;
    setTick((t) => t + 1);
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden h-[120vh] md:h-[100vh] w-full"
      style={{
        background: `radial-gradient(circle at 20% 20%, ${theme.saffron}10 0%, transparent 30%), radial-gradient(circle at 80% 80%, ${theme.emerald}10 0%, transparent 30%), #fff`,
      }}
      aria-label="Our partners"
    >
      {/* heading */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[10000] text-center w-full">
      <h2
  className="m-0 font-light text-3xl md:text-5xl bg-gradient-to-r from-[var(--saffron)] via-[var(--emerald)] to-[var(--saffron)] bg-[length:200%_200%] animate-gradient-move bg-clip-text text-transparent pt-10"
  style={{
    "--saffron": theme.saffron,
    "--emerald": theme.emerald,
  }}
>
  Our Partners
</h2>

        <p className="mt-1 text-sm text-slate-600">Tap / click a bubble to explore — clicked bubble will appear on top</p>
      </div>

      {/* bubble field */}
      <div className="relative w-full h-full">
        {bubbles.map((b) => (
          <Bubble
            key={b.id}
            id={b.id}
            logo={b.logo}
            size={b.size}
            initial={{ left: b.left, top: b.top, vx: b.vx, vy: b.vy }}
            containerRef={containerRef}
            onActivate={(id) => bringToFront(id)}
            zIndex={zMapRef.current[b.id]}
            theme={theme}
          />
        ))}
      </div>
    </section>
  );
}
