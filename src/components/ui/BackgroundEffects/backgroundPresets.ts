// @/components/ui/BackgroundEffects/backgroundPresets.ts

import TweenVars = gsap.TweenVars;

/** Per-step function */
export type StepFn<T = number> = (stepIndex: number, totalSteps: number) => T;

export interface BackgroundPreset {
  name: string;
  /** Final height (px) for each step. Drive height here, not in `to`. */
  getHeight: StepFn<number>;
  /** Animation config; `from` is static TweenVars, `to` is computed per step */
  animation: {
    from: TweenVars;
    to: (stepIndex: number, totalSteps: number) => TweenVars;
  };
}
export const backgroundPresets: BackgroundPreset[] = [
  // === Your original "depth-cascade" converted (height via getHeight) ===
  {
    name: "depth-cascade",
    getHeight: () => 100,
    animation: {
      from: {
        opacity: 0,
        force3D: true,
        scale: 2,
        z: 0,
        x: 100,
        y: -150,
        filter: "blur(0px)",
      },
      to: (i) => ({
        filter: "blur(0px)",
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        z: 0,
        rotateX: "1deg",
        rotateY: "1deg",
        rotateZ: "1deg",
        duration: 1.5,
        ease: "power3.inOut",
        delay: 0.1 * i,
      }),
    },
  },

  // === Your THREE additional blocks converted and named ===
  {
    name: "far-depth-zoom",
    getHeight: () => 500, // pick your final height target (was only in `from` originally)
    animation: {
      from: {
        opacity: 0,
        force3D: true,
        scale: 3,
        z: 500,
        x: 100,
        y: -150,
        filter: "blur(4px)",
      },
      to: (i) => ({
        filter: "blur(0px)",
        opacity: 1,
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
    name: "near-depth-fan",
    getHeight: () => 500,
    animation: {
      from: {
        opacity: 1,
        force3D: true,
        scale: 1,
        z: 500,
        x: -10,
        y: -50,
        filter: "blur(2px)",
      },
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
    getHeight: () => 500,
    animation: {
      from: {
        opacity: 1,
        force3D: true,
        scale: 1,
        z: -100,
        x: 10,
        y: 50,
        filter: "blur(6px)",
      },
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

  // === The rest of your simpler, readable presets (unchanged, but typed) ===
  {
    name: "cascade-grow",
    getHeight: (i) => 150 + i * 25,
    animation: {
      from: {
        opacity: 0,
        scale: 0.8,
        x: -30,
        y: 20,
        z: -50,
        filter: "blur(4px)",
        force3D: true,
      },
      to: (i, total) => ({
        opacity: 1,
        scale: 1 + i * 0.05,
        x: i * 8,
        y: -(i * 5),
        z: i * 15,
        rotateX: `${i * 2}deg`,
        rotateY: `${i * 1.5}deg`,
        rotateZ: `${i * 3}deg`,
        filter: "blur(0px)",
        duration: 2,
        ease: "power3.out",
        delay: 0.1 * i,
      }),
    },
  },
  {
    name: "cascade-shrink",
    getHeight: (i) => 400 - i * 20,
    animation: {
      from: {
        opacity: 0,
        scale: 2,
        x: 50,
        y: -30,
        z: 100,
        filter: "blur(6px)",
        force3D: true,
      },
      to: (i) => ({
        opacity: 1,
        scale: 1.5 - i * 0.05,
        x: -(i * 6),
        y: i * 8,
        z: -(i * 12),
        rotateX: `${-i * 3}deg`,
        rotateY: `${i * 2}deg`,
        rotateZ: `${-i * 2}deg`,
        filter: "blur(0px)",
        duration: 1.8,
        ease: "back.out(1.2)",
        delay: 0.08 * i,
      }),
    },
  },
  {
    name: "wave",
    getHeight: (i, total) => 200 + Math.sin((i / total) * Math.PI * 2) * 80,
    animation: {
      from: {
        opacity: 0,
        scale: 0.5,
        x: -100,
        y: 0,
        z: 0,
        filter: "blur(8px)",
        force3D: true,
      },
      to: (i, total) => ({
        opacity: 1,
        scale: 1.2 + Math.sin((i / total) * Math.PI) * 0.3,
        x: Math.cos(i * 0.8) * 20,
        y: Math.sin(i * 0.6) * 15,
        z: Math.sin(i * 0.4) * 25,
        rotateX: `${Math.sin(i * 0.5) * 10}deg`,
        rotateY: `${i * 4}deg`,
        rotateZ: `${Math.cos(i * 0.7) * 8}deg`,
        filter: "blur(0px)",
        duration: 2.2,
        ease: "elastic.out(1, 0.4)",
        delay: 0.12 * i,
      }),
    },
  },
  {
    name: "mountain",
    getHeight: (i, total) => {
      const center = total / 2;
      const distance = Math.abs(i - center);
      return 300 - distance * 15;
    },
    animation: {
      from: {
        opacity: 0,
        scale: 1.5,
        x: 0,
        y: 100,
        z: -100,
        filter: "blur(5px)",
        force3D: true,
      },
      to: (i, total) => ({
        opacity: 1,
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
    name: "spiral",
    getHeight: (i, total) => 100 + Math.pow(i / total, 2) * 300,
    animation: {
      from: {
        opacity: 0,
        scale: 0.3,
        x: 0,
        y: 0,
        z: -200,
        filter: "blur(10px)",
        force3D: true,
      },
      to: (i, total) => ({
        opacity: 1,
        scale: 0.8 + (i / total) * 1.5,
        x: Math.cos(i * 0.8) * (i * 8),
        y: Math.sin(i * 0.8) * (i * 8),
        z: i * 20,
        rotateX: `${i * 8}deg`,
        rotateY: `${i * 12}deg`,
        rotateZ: `${i * 15}deg`,
        filter: "blur(0px)",
        duration: 2.5,
        ease: "back.out(1.5)",
        delay: 0.15 * i,
      }),
    },
  },
  {
    name: "stepped",
    getHeight: (i) => 150 + Math.floor(i / 3) * 60,
    animation: {
      from: {
        opacity: 0,
        scale: 1,
        x: 40,
        y: -20,
        z: 0,
        filter: "blur(3px)",
        force3D: true,
      },
      to: (i) => ({
        opacity: 1,
        scale: 1.2 + Math.floor(i / 3) * 0.1,
        x: (i % 3) * 15,
        y: -(Math.floor(i / 3) * 20),
        z: Math.floor(i / 3) * 25,
        rotateX: `${Math.floor(i / 3) * 5}deg`,
        rotateY: `${i * 2}deg`,
        rotateZ: `${(i % 3) * 3}deg`,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.inOut",
        delay: 0.1 * Math.floor(i / 3),
      }),
    },
  },
  {
    name: "fan",
    getHeight: (i) => 180 + i * 18,
    animation: {
      from: {
        opacity: 0,
        scale: 0.9,
        x: 0,
        y: 0,
        z: -100,
        filter: "blur(4px)",
        force3D: true,
      },
      to: (i, total) => ({
        opacity: 1,
        scale: 1 + i * 0.03,
        x: (i - total / 2) * 15,
        y: -(i * 8),
        z: i * 12,
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
    name: "zigzag",
    getHeight: (i) => 200 + (i % 2 === 0 ? i * 15 : (11 - i) * 10),
    animation: {
      from: {
        opacity: 0,
        scale: 0.8,
        x: 0,
        y: 30,
        z: 20,
        filter: "blur(5px)",
        force3D: true,
      },
      to: (i) => ({
        opacity: 1,
        scale: 1 + (i % 2 === 0 ? 0.2 : -0.1),
        x: i % 2 === 0 ? i * 8 : -(i * 6),
        y: -(i * 6),
        z: i % 2 === 0 ? i * 10 : i * 5,
        rotateX: `${(i % 2 === 0 ? 1 : -1) * i * 3}deg`,
        rotateY: `${i * 4}deg`,
        rotateZ: `${(i % 2 === 0 ? 1 : -1) * i * 2}deg`,
        filter: "blur(0px)",
        duration: 1.8,
        ease: "power3.inOut",
        delay: 0.1 * (i % 2 === 0 ? i : 11 - i),
      }),
    },
  },
  {
    name: "bounce",
    getHeight: (i) => 250 + Math.abs(Math.sin(i * 0.5)) * 150,
    animation: {
      from: {
        opacity: 0,
        scale: 0.6,
        x: -50,
        y: -100,
        z: 0,
        filter: "blur(6px)",
        force3D: true,
      },
      to: (i) => ({
        opacity: 1,
        scale: 1 + Math.abs(Math.sin(i * 0.5)) * 0.3,
        x: i * 6,
        y: Math.abs(Math.sin(i * 0.5)) * -20,
        z: i * 10,
        rotateX: `${i * 3}deg`,
        rotateY: `${Math.sin(i * 0.5) * 10}deg`,
        rotateZ: `${i * 2}deg`,
        filter: "blur(0px)",
        duration: 2,
        ease: "bounce.out",
        delay: 0.1 * i,
      }),
    },
  },
  {
    name: "accordion",
    getHeight: (i) => 180 + i * 12,
    animation: {
      from: {
        opacity: 0,
        scaleX: 0.5,
        scaleY: 1.2,
        x: -80,
        y: 0,
        z: -50,
        filter: "blur(4px)",
        force3D: true,
      },
      to: (i) => ({
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        x: i * 10,
        y: -(i * 7),
        z: i * 8,
        rotateX: `${i * 1.5}deg`,
        rotateY: `${i * 2}deg`,
        rotateZ: `${i * 1}deg`,
        filter: "blur(0px)",
        duration: 1.3,
        ease: "power3.out",
        delay: 0.08 * i,
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
