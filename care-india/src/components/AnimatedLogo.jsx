// AnimatedLogoCareIndia.jsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

export default function AnimatedLogo({
  size = 160,          // desktop max
  minSize = 88,        // mobile min
  vwBase = 34,         // middle term of clamp: Xvw
  responsive = true,   // toggle responsive sizing
}) {
  const root = useRef(null);
  const raf = useRef(null);
  const state = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, scale: 1 });
  const [canTilt, setCanTilt] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // feature detect: hover & fine pointer => allow tilt
  useEffect(() => {
    const hoverFine =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setCanTilt(hoverFine);

    const rmq =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateRM = () => setReduceMotion(!!rmq?.matches);
    updateRM();
    rmq?.addEventListener?.("change", updateRM);
    return () => rmq?.removeEventListener?.("change", updateRM);
  }, []);

  // RAF loop -> apply 3D tilt transform (only when canTilt & not reduced motion)
  useEffect(() => {
    if (!canTilt || reduceMotion) return;
    let mounted = true;
    const loop = () => {
      if (!mounted) return;
      const { rx, ry, tx, ty, scale } = state.current;
      if (root.current) {
        root.current.style.transform =
          `perspective(900px) translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { mounted = false; cancelAnimationFrame(raf.current); };
  }, [canTilt, reduceMotion]);

  // Pointer motion (only on hover: hover devices)
  useEffect(() => {
    if (!canTilt || reduceMotion) return;
    const el = root.current;
    if (!el) return;

    const onMove = (e) => {
      const evt = e.touches ? e.touches[0] : e;
      const r = el.getBoundingClientRect();
      const px = (evt.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const py = (evt.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const max = 10;
      state.current.rx = Math.max(Math.min(-py * max, max), -max);
      state.current.ry = Math.max(Math.min(px * max, max), -max);
      state.current.tx = px * 4;
      state.current.ty = -py * 4;
      state.current.scale = 1.03;
    };
    const onEnter = () => (state.current.scale = 1.03);
    const onLeave = () => {
      state.current.rx = 0; state.current.ry = 0;
      state.current.tx = 0; state.current.ty = 0;
      state.current.scale = 1;
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    // no touch listeners -> mobile battery friendly

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [canTilt, reduceMotion]);

  // tiny idle breathe (disabled if reduced motion OR no tilt)
  useEffect(() => {
    if (reduceMotion) return;
    let t = 0, mounted = true;
    const idle = () => {
      if (!mounted) return;
      t += 0.02;
      // subtler on mobile because no tilt
      const amp = canTilt ? 0.004 : 0.003;
      state.current.scale = 1 + Math.sin(t) * amp;
      raf.current = requestAnimationFrame(idle);
    };
    raf.current = requestAnimationFrame(idle);
    return () => { mounted = false; cancelAnimationFrame(raf.current); };
  }, [canTilt, reduceMotion]);

  // sizing: clamp(min, vw, max)
  const widthStyle = responsive
    ? `clamp(${minSize}px, ${vwBase}vw, ${size}px)`
    : `${size}px`;

  return (
    <Link href="/" aria-label="Care India Welfare Trust">
      <div
        ref={root}
        className="cursor-pointer select-none"
        style={{
          width: widthStyle,
          height: widthStyle,
          display: "inline-block",
          willChange: "transform",
        }}
      >
        <svg
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full block"
          role="img"
          aria-label="Care India tilted logo with orbiting dots"
        >
          <defs>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feBlend in="SourceGraphic" in2="b" mode="screen" />
            </filter>
          </defs>

          {/* Orbs */}
          <g className="orbits" style={{ filter: "url(#softGlow)" }}>
            <circle className="orb orb-a" r="4.6" fill="#3b82f6" cx="100" cy="12" />
            <circle className="orb orb-b" r="4.2" fill="#10b981" cx="188" cy="100" />
            <circle className="orb orb-c" r="3.8" fill="#fb923c" cx="100" cy="188" />
            <circle className="orb orb-d" r="3.0" fill="#f97316" cx="12" cy="100" />
          </g>

          {/* Center image */}
          <image
            href="/logo.ico"
            x={100 - 56}
            y={100 - 56}
            width={112}
            height={112}
            preserveAspectRatio="xMidYMid meet"
            className="centerImg"
            aria-hidden="true"
          />

          <style jsx>{`
            .orbits { transform-origin: 100px 100px; }
            .orb-a { animation: orbitA 12s linear infinite; transform-origin: 100px 100px; }
            .orb-b { animation: orbitB 9.2s linear infinite; transform-origin: 100px 100px; }
            .orb-c { animation: orbitC 15s linear infinite; transform-origin: 100px 100px; }
            .orb-d { animation: orbitD 8s linear infinite; transform-origin: 100px 100px; }

            .centerImg {
              transform-box: fill-box;
              transform-origin: 50% 50%;
              animation: logoTilt 4.6s ease-in-out infinite;
              will-change: transform;
            }

            @keyframes logoTilt {
              0% { transform: rotate(-1.8deg) translateY(0); }
              25% { transform: rotate(2deg) translateY(-1px); }
              50% { transform: rotate(-1.2deg) translateY(0); }
              75% { transform: rotate(1.6deg) translateY(-1px); }
              100% { transform: rotate(-1.8deg) translateY(0); }
            }

            @keyframes orbitA { 0% { transform: rotate(0deg) translateY(-84px) rotate(0deg);} 100% { transform: rotate(360deg) translateY(-84px) rotate(-360deg);} }
            @keyframes orbitB { 0% { transform: rotate(0deg) translateX(84px) rotate(0deg);} 100% { transform: rotate(-360deg) translateX(84px) rotate(360deg);} }
            @keyframes orbitC { 0% { transform: rotate(0deg) translateY(84px) rotate(0deg);} 100% { transform: rotate(360deg) translateY(84px) rotate(-360deg);} }
            @keyframes orbitD { 0% { transform: rotate(0deg) translateX(-84px) rotate(0deg);} 100% { transform: rotate(-360deg) translateX(-84px) rotate(360deg);} }

            /* Mobile tune: slightly smaller orbs radii when container shrinks a lot */
            @media (max-width: 380px) {
              .orb-a, .orb-b, .orb-c, .orb-d { filter: none; } /* perf */
            }

            @media (prefers-reduced-motion: reduce) {
              .orb-a, .orb-b, .orb-c, .orb-d, .centerImg { animation: none !important; }
            }
          `}</style>
        </svg>
      </div>
    </Link>
  );
}
