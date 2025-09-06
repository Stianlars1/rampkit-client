import { getColorFromCSS } from "@/lib/utils/color-utils";

export type AnimationConfig = {
  from: Record<string, any>;
  to: Record<string, any>;
};

export type HeightCalculation = (index: number, totalSteps: number) => number;

// Height calculation functions
export const heightCalculations: HeightCalculation[] = [
  (index: number, totalSteps: number) => 100 + (250 / (totalSteps - 1)) * index,
  (index: number, totalSteps: number) => 500 - (250 / (totalSteps - 1)) * index,
  (index: number, totalSteps: number) => 300 - (index * 30) / 2,
  (index: number, totalSteps: number) => 0 + (index * 30) / 2,
  (index: number, totalSteps: number) => 500 - (index * 30) / 2,
  (index: number, totalSteps: number) => 800 + (700 / (totalSteps - 1)) * index,

  (index: number, totalSteps: number) => 300 + index * 40,
  (index: number, totalSteps: number) => 600 - index * 30,
  (index: number, totalSteps: number) => 300 + index * 30,
  (index: number, totalSteps: number) => 200 + index * 5,
  (index: number, totalSteps: number) => 200 + index * -10,
];

// Animation configuration presets
export const animationConfigs: AnimationConfig[] = [
  // Depth cascade preset
  {
    from: {
      opacity: 0,
      force3D: true,
      scale: 2,
      z: 0,
      x: 100,
      y: -150,
      filter: "blur(0px)",
      height: 500,
    },
    to: {
      filter: "blur(0px)",
      opacity: 1,
      scale: (index: number) => 1,
      x: (index: number) => 0,
      y: (index: number) => 0,
      z: (index: number) => 0,
      rotateX: (index: number) => `${1}deg`,
      rotateY: (index: number) => `${1}deg`,
      rotateZ: (index: number) => `${1}deg`,
      duration: 1.5,
      ease: "power3.inOut",
      delay: (index: number) => 0.1 * index,
      height: (index: number) => 100,
    },
  },

  {
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
      scale: (index: number) => 4 - 0.1 * index,
      x: (index: number) => 0,
      y: (index: number) => 0,
      rotateX: (index: number) => `${index * 2}deg`,
      rotateY: (index: number) => `${index * 1.5}deg`,
      rotateZ: (index: number) => `${index * 4}deg`,
      z: (index: number) => 10 * index,
      duration: 1.5,
      ease: "power3.inOut",
      delay: (index: number) => 0.1 * index,
    },
  },

  {
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
      scale: (index: number) => 4 - 0.1 * index,
      x: (index: number) => 5 * index,
      y: (index: number) => -10 * index,
      rotateX: (index: number) => `${index * 2}deg`,
      rotateY: (index: number) => `${index * 1.5}deg`,
      rotateZ: (index: number) => `${index * 4}deg`,
      z: (index: number) => 10 * index,
      duration: 1.5,
      ease: "power3.inOut",
      delay: (index: number) => 0.1 * index,
    },
  },
  {
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
      scale: (index: number) => 4 - 0.1 * index,
      x: (index: number) => 5 * index,
      y: (index: number) => -10 * index,
      rotateX: (index: number) => `${index * 2}deg`,
      rotateY: (index: number) => `${index * 1.5}deg`,
      rotateZ: (index: number) => `${index * 4}deg`,
      z: (index: number) => 10 * index,
      duration: 1.5,
      ease: "power3.inOut",
      delay: (index: number) => 0.1 * index,
    },
  },

  // Spiral preset
  /*  {
    from: {
      opacity: 0,
      force3D: true,
      scale: 0.1,
      z: -200,
      x: 0,
      y: 0,
      filter: "blur(10px)",
    },
    to: {
      filter: "blur(0px)",
      scale: (index: number, totalSteps: number) =>
        1 + (index / totalSteps) * 2,
      x: (index: number) => Math.cos(index * 0.5) * 100,
      y: (index: number) => Math.sin(index * 0.5) * 100,
      rotateX: (index: number) => `${index * 10}deg`,
      rotateY: (index: number) => `${index * 15}deg`,
      rotateZ: (index: number) => `${index * 20}deg`,
      z: (index: number) => index * 20,
      duration: 2,
      ease: "back.out(1.7)",
      delay: (index: number) => 0.15 * index,
    },
  },*/

  // Wave preset
  /*  {
    from: {
      opacity: 0.2,
      force3D: true,
      scale: 0.5,
      z: 0,
      x: -200,
      y: 0,
      filter: "blur(8px)",
    },
    to: {
      filter: "blur(0px)",
      scale: (index: number, totalSteps: number) =>
        1.5 + Math.sin(index * 0.3) * 0.5,
      x: (index: number) => index * 15,
      y: (index: number) => Math.sin(index * 0.8) * 50,
      rotateX: (index: number) => `${Math.sin(index * 0.4) * 15}deg`,
      rotateY: (index: number) => `${index * 3}deg`,
      rotateZ: (index: number) => `${Math.cos(index * 0.6) * 10}deg`,
      z: (index: number) => Math.sin(index * 0.2) * 30,
      duration: 1.8,
      ease: "elastic.out(1, 0.3)",
      delay: (index: number) => 0.08 * index,
    },
  },*/
];

// Helper functions
export const getRandomHeightCalculation = (): HeightCalculation => {
  return heightCalculations[
    Math.floor(Math.random() * heightCalculations.length)
  ];
};

export const getRandomAnimationConfig = (): AnimationConfig => {
  return animationConfigs[Math.floor(Math.random() * animationConfigs.length)];
};

// Process animation values (handles both static values and functions)
export const processAnimationValue = (
  value: any,
  index: number,
  totalSteps: number,
): any => {
  if (typeof value === "function") {
    return value(index, totalSteps);
  }
  return value;
};
