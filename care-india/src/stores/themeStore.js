// src/stores/themeStore.js
import { create } from "zustand";

const defaultSaffron = "#FF9933";
const defaultEmerald = "#10b981";
const defaultGrad = `linear-gradient(135deg, ${defaultSaffron} 0%, #FFB347 40%, ${defaultEmerald} 100%)`;
const defaultGradSoft = `linear-gradient(135deg, rgba(255,153,51,0.92) 0%, rgba(255,179,71,0.92) 40%, rgba(16,185,129,0.92) 100%)`;

export const useThemeStore = create((set) => ({
  // colors
  saffronMid: defaultSaffron,
  emeraldMid: defaultEmerald,
  GRAD: defaultGrad,
  GRAD_SOFT: defaultGradSoft,

  // animation controls (new)
  // animationEnabled: global toggle for UI animations (cards, reveal, particles)
  // animationSpeed: multiplier (1 = baseline speed, 0.5 = faster, 1.5 = slower)
  // headingAnimEnabled: specifically control heading text gradient animation
  animationEnabled: true,
  animationSpeed: 1, // multiplier for durations (1 = normal)
  headingAnimEnabled: true,

  // setters
  setSaffron: (hex) => set({ saffronMid: hex }),
  setEmerald: (hex) => set({ emeraldMid: hex }),
  setGrad: (gradStr) => set({ GRAD: gradStr }),
  setGradSoft: (gradStr) => set({ GRAD_SOFT: gradStr }),

  // animation setters
  setAnimationEnabled: (flag) => set({ animationEnabled: !!flag }),
  setAnimationSpeed: (mult) => set({ animationSpeed: Math.max(0.25, Number(mult) || 1) }),
  setHeadingAnimEnabled: (flag) => set({ headingAnimEnabled: !!flag }),

  // quick helper: set two-color gradient and primary
  setGradientFromColors: (c1, c2) =>
    set({
      saffronMid: c1,
      emeraldMid: c2,
      GRAD: `linear-gradient(135deg, ${c1} 0%, ${c1.replace("#", "#")} 40%, ${c2} 100%)`,
      GRAD_SOFT: `linear-gradient(135deg, ${c1}88 0%, ${c1}66 40%, ${c2}66 100%)`,
    }),
}));
