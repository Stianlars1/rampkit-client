import TweenVars = gsap.TweenVars;
import {
  getHeightByVariant,
  getOpacityByVariant,
} from "@/components/ui/BackgroundEffects/gsapUtils";

/** Per-step function */
export type StepFn<T = number> = (stepIndex: number, totalSteps: number) => T;

export interface BackgroundPreset {
  name: string;
  /** Final height (px) for each step. Drive height here, not in `to`. */
  getHeight: StepFn<number>;
  getOpacity: StepFn<number>;
  /** Animation config; both `from` and `to` are functions */
  animation: {
    from: (stepIndex: number, totalSteps: number) => TweenVars;
    to: (stepIndex: number, totalSteps: number) => TweenVars;
  };
}

export const backgroundPresets: BackgroundPreset[] = [
  {
    name: "near-depth-fan",
    getOpacity: (index, totalSteps) =>
      getOpacityByVariant(index, totalSteps, "sine-ease-in-out"),
    getHeight: () => 500,
    animation: {
      from: (i, total) => ({
        opacity: 1,
        force3D: true,
        scale: 1,
        z: 500,
        x: -10,
        y: -50,
        filter: "blur(2px)",
      }),
      to: (i) => ({
        filter: "blur(0px)",
        scale: 4 - 0.1 * i,
        x: 5 * i,
        y: -10 * i,
        rotateX: `${i * 2}deg`,
        rotateY: `${i * 1.5}deg`,
        rotateZ: `${i * 4}deg`,
        z: 10 * i,
        duration: 1.5,
        ease: "power3.inOut",
        delay: 0.1 * i,
      }),
    },
  },

  {
    name: "reverse-depth-sweep",
    getOpacity: (index, totalSteps) =>
      getOpacityByVariant(index, totalSteps, "center-peak"),
    getHeight: () => 500,
    animation: {
      from: (i, total) => ({
        opacity: 1,
        force3D: true,
        scale: 1,
        z: -100,
        x: 10,
        y: 50,
        filter: "blur(6px)",
      }),
      to: (i) => ({
        filter: "blur(0px)",
        scale: 4 - 0.1 * i,
        x: 5 * i,
        y: -10 * i,
        rotateX: `${i * 2}deg`,
        rotateY: `${i * 1.5}deg`,
        rotateZ: `${i * 4}deg`,
        z: 10 * i,
        duration: 1.5,
        ease: "power3.inOut",
        delay: 0.1 * i,
      }),
    },
  },

  {
    name: "far-depth-zoom",
    getOpacity: (index, totalSteps) =>
      getOpacityByVariant(index, totalSteps, "exponential-ease-in"),
    getHeight: () => 500,
    animation: {
      from: (i, total) => ({
        opacity: 0,
        force3D: true,
        scale: 3,
        z: 500,
        x: 100,
        y: -150,
        filter: "blur(4px)",
      }),
      to: (i) => ({
        filter: "blur(0px)",
        scale: 4 - 0.1 * i,
        x: 0,
        y: 0,
        rotateX: `${i * 2}deg`,
        rotateY: `${i * 1.5}deg`,
        rotateZ: `${i * 4}deg`,
        z: 10 * i,
        duration: 1.5,
        ease: "power3.inOut",
        delay: 0.1 * i,
      }),
    },
  },
  {
    name: "accordion",
    getOpacity: (index, totalSteps) =>
      getOpacityByVariant(index, totalSteps, "exponential-ease-in"),
    getHeight: (i, total) =>
      getHeightByVariant(i, total, "linear-ascending", 180, 324),
    animation: {
      from: (i) => ({
        opacity: 0,
        scaleX: 0.5,
        scaleY: 1.2,
        x: -80,
        y: 0,
        z: -50,
        filter: "blur(4px)",
        force3D: true,
      }),
      to: (i) => ({
        scaleX: 1,
        scaleY: 1,
        x: i * 2.5,
        y: -(i * 5),
        z: i * 4,
        rotateX: `${i * 1.1}deg`,
        rotateY: `${i * 1.7}deg`,
        rotateZ: `${i * 0.8}deg`,
        filter: "blur(0px)",
        duration: 1.3,
        ease: "power3.out",
        delay: 0.08 * i,
      }),
    },
  },
  {
    name: "fan",
    getOpacity: (index, totalSteps) =>
      getOpacityByVariant(index, totalSteps, "linear"),
    getHeight: (i) => getHeightByVariant(i, 12, "linear-ascending", 180, 396),
    animation: {
      from: (i, total) => ({
        opacity: 0,
        scale: 0.9,
        x: 0,
        y: 0,
        z: -100,
        filter: "blur(4px)",
        force3D: true,
      }),
      to: (i, total) => ({
        opacity: 1,
        scale: 1 + i * 0.03,
        x: (i - total / 2) * 5,
        y: -(i * 8),
        z: i * 6,
        rotateX: `${i * 2}deg`,
        rotateY: `${(i - total / 2) * 3}deg`,
        rotateZ: `${i * 2.5}deg`,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power2.out",
        delay: 0.07 * i,
      }),
    },
  },

  {
    name: "stepped",
    getOpacity: (index, totalSteps) =>
      getOpacityByVariant(index, totalSteps, "linear"),
    getHeight: (i, total) =>
      getHeightByVariant(i, total, "stepped-3", 150, 240),
    animation: {
      from: (i) => ({
        opacity: 0,
        scale: 1,
        x: -40,
        y: 20,
        z: 0,
        filter: "blur(3px)",
        force3D: true,
      }),
      to: (i) => ({
        scale: 1 + Math.floor(i / 3) * 0.1,
        x: -1 * 20,
        y: -(Math.floor(i / 3) * 20),
        z: Math.floor(i / 3) * 15,
        rotateX: `${Math.floor(i / 3) * 2}deg`,
        rotateY: `${i * 1}deg`,
        rotateZ: `${(i % 2) * 2}deg`,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.inOut",
        delay: 0.1 * Math.floor(i / 3),
      }),
    },
  },

  {
    name: "spiral",
    getOpacity: (index, totalSteps) =>
      getOpacityByVariant(index, totalSteps, "quadratic-ease-in"),
    getHeight: (i, total) =>
      getHeightByVariant(i, total, "quadratic-growth", 50, 150),
    animation: {
      from: (i, total) => ({
        opacity: 0,
        scale: 0.5,
        x: 0,
        y: 0,
        z: -100,
        filter: "blur(10px)",
        force3D: true,
      }),
      to: (i, total) => ({
        scale: 2 + i / total,
        x: Math.cos(i * 0.4) * (i * 2),
        y: Math.sin(i * 0.6) * (i * 4),
        z: -i * 5,
        rotateX: `${i * 8}deg`,
        rotateY: `${i * 12}deg`,
        rotateZ: `${i * 10}deg`,
        filter: "blur(0px)",
        duration: 2.5,
        ease: "back.out(2)",
        delay: 0.15 * i,
      }),
    },
  },
  {
    name: "mountain",
    getOpacity: (index, totalSteps) =>
      getOpacityByVariant(index, totalSteps, "linear"),
    getHeight: (i, total) =>
      getHeightByVariant(i, total, "mountain-peak", 150, 300),
    animation: {
      from: () => ({
        opacity: 0,
        scale: 1.5,
        x: 0,
        y: 100,
        z: -100,
        filter: "blur(3px)",
        force3D: true,
      }),
      to: (i, total) => ({
        scale: 1 + (1 - Math.abs(i - total / 2) / (total / 2)) * 0.5,
        x: (i - 6) * 10,
        y: -(Math.abs(i - total / 2) * 3),
        z: (total - Math.abs(i - total / 2)) * 3,
        rotateX: `${i * 1.5}deg`,
        rotateY: `${(i - 6) * 2}deg`,
        rotateZ: `${i}deg`,
        filter: "blur(0px)",
        duration: 1.6,
        ease: "power2.out",
        delay: 0.06 * i,
      }),
    },
  },

  {
    name: "wave",
    getOpacity: (index, totalSteps) =>
      getOpacityByVariant(index, totalSteps, "linear"),
    getHeight: (i, total) => getHeightByVariant(i, total, "double-peak"),
    animation: {
      from: (i, total) => ({
        opacity: 0,
        scale: 2 - Math.sin((i / total) * Math.PI) * 0.5,
        x: 100,
        y: 0,
        z: 0,
        filter: "blur(8px)",
        force3D: true,
      }),
      to: (i, total) => ({
        scale: 1.2 + Math.sin((i / total) * Math.PI) * 0.15,
        x: Math.cos(i * 0.2) * 5,
        y: Math.sin(i * 0.3) * 3,
        z: Math.sin(i * 0.3) * 10,
        rotateX: `${Math.sin(i * 0.5) * 10}deg`,
        rotateY: `${i * 4}deg`,
        rotateZ: `${Math.cos(i * 0.7) * 8}deg`,
        filter: "blur(0px)",
        duration: 2.2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.12 * i,
      }),
    },
  },

  {
    name: "cascade-shrink",
    getOpacity: (index, totalSteps) =>
      getOpacityByVariant(index, totalSteps, "cubic-ease-out"),
    getHeight: (i) => getHeightByVariant(i, 12, "linear-descending", 150, 300),
    animation: {
      from: (i, total) => ({
        opacity: 0,
        scale: 2,
        x: 100,
        y: -60,
        z: 250,
        filter: "blur(24px)",
        force3D: true,
      }),
      to: (i) => ({
        scale: 1.5 - i * 0.05,
        x: 0,
        y: i * 15,
        z: -(i * 12),
        rotateX: `${-i * 6}deg`,
        rotateY: `${i * 2}deg`,
        rotateZ: `${i * 2}deg`,
        filter: "blur(0px)",
        duration: 1.8,
        ease: "back.out(1.2)",
        delay: 0.08 * i,
      }),
    },
  },

  {
    name: "cascade-grow",
    getOpacity: (index, totalSteps) =>
      getOpacityByVariant(index, totalSteps, "fibonacci-based"),
    getHeight: (i) => getHeightByVariant(i, 12, "linear-descending", 150, 300),
    animation: {
      from: (i, total) => ({
        opacity: 0,
        scale: 0.8,
        x: -30,
        y: 20,
        z: -50,
        filter: "blur(23px)",
        force3D: true,
      }),
      to: (i) => ({
        scale: 1 + i * 0.05,
        x: -100,
        y: (i + 10) * 10,
        z: i * 20,
        rotateX: `${i * 2}deg`,
        rotateY: `${i * 1.5}deg`,
        rotateZ: `${i * 3}deg`,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        delay: 0.05 * i,
      }),
    },
  },
];

// Simple random selector
/** Random selector */
export function getRandomPreset(): BackgroundPreset {
  const idx = Math.floor(Math.random() * backgroundPresets.length);
  return backgroundPresets[idx];
}

// Helper function for immediate first element
const getInstantEase = (index: number, defaultEase: string): string => {
  return index === 0 ? "power1.out" : defaultEase; // Faster ease for first element
};

const getInstantDuration = (index: number, defaultDuration: number): number => {
  return index === 0 ? Math.max(defaultDuration * 0.3, 0.2) : defaultDuration; // 30% duration for first
};
