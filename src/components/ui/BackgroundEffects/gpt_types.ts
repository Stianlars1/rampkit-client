// ----- Minimal types/helpers (inline)

export type StepVal<T = any> = T | ((index: number, total: number) => T);
export type Preset = {
  id: string;
  from: Record<string, StepVal>;
  to: Record<string, StepVal>;
};
export const val = <T>(v: StepVal<T>, i: number, total: number): T =>
  typeof v === "function" ? (v as unknown as any)(i, total) : v;

// ----- Presets (your 4 raw ones, unchanged in behavior)
export const PRESETS: Preset[] = [
  {
    id: "depth-cascade",
    from: {
      opacity: 0,
      force3D: true,
      scale: 2,
      z: 0,
      x: 100,
      y: -150,
      filter: "blur(0px)",
      height: 500, // start height
    },
    to: {
      filter: "blur(0px)",
      opacity: 1,
      scale: () => 1,
      x: () => 0,
      y: () => 0,
      z: () => 0,
      rotateX: () => "1deg",
      rotateY: () => "1deg",
      rotateZ: () => "1deg",
      duration: 1.5,
      ease: "power3.inOut",
      delay: (i: number) => 0.1 * i,
      height: () => 100, // end height
    },
  },
  {
    id: "zoom-rotate-far",
    from: {
      opacity: 0,
      force3D: true,
      scale: 3,
      z: 500,
      x: 100,
      y: -150,
      filter: "blur(4px)",
    },
    to: {
      filter: "blur(0px)",
      opacity: 1,
      scale: (i: number) => 4 - 0.1 * i,
      x: () => 0,
      y: () => 0,
      rotateX: (i: number) => `${i * 2}deg`,
      rotateY: (i: number) => `${i * 1.5}deg`,
      rotateZ: (i: number) => `${i * 4}deg`,
      z: (i: number) => 10 * i,
      duration: 1.5,
      ease: "power3.inOut",
      delay: (i: number) => 0.1 * i,
    },
  },
  {
    id: "slide-fan-far",
    from: {
      opacity: 1,
      force3D: true,
      scale: 1,
      z: 500,
      x: -10,
      y: -50,
      filter: "blur(2px)",
    },
    to: {
      filter: "blur(0px)",
      scale: (i: number) => 4 - 0.1 * i,
      x: (i: number) => 5 * i,
      y: (i: number) => -10 * i,
      rotateX: (i: number) => `${i * 2}deg`,
      rotateY: (i: number) => `${i * 1.5}deg`,
      rotateZ: (i: number) => `${i * 4}deg`,
      z: (i: number) => 10 * i,
      duration: 1.5,
      ease: "power3.inOut",
      delay: (i: number) => 0.1 * i,
    },
  },
  {
    id: "slide-fan-near",
    from: {
      opacity: 1,
      force3D: true,
      scale: 1,
      z: -100,
      x: 10,
      y: 50,
      filter: "blur(6px)",
    },
    to: {
      filter: "blur(0px)",
      scale: (i: number) => 4 - 0.1 * i,
      x: (i: number) => 5 * i,
      y: (i: number) => -10 * i,
      rotateX: (i: number) => `${i * 2}deg`,
      rotateY: (i: number) => `${i * 1.5}deg`,
      rotateZ: (i: number) => `${i * 4}deg`,
      z: (i: number) => 10 * i,
      duration: 1.5,
      ease: "power3.inOut",
      delay: (i: number) => 0.1 * i,
    },
  },
];
