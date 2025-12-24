import { describe, it, expect } from "vitest";
import { hexToHSL, hslToHex } from "../colorConverters";
import { getAllHarmonyColors } from "../ColorTheory";

/**
 * Color Theory Tests
 *
 * These tests verify that our pure color theory calculations match
 * mathematically correct values. Test cases provided by user.
 *
 * Base color: #007DB8 (Hue: 199.24°, S: 100%, L: 36.08%)
 */

// Helper to rotate hue and convert back to hex (pure color theory)
function rotateHue(hex: string, degrees: number): string {
  const hsl = hexToHSL(hex, true); // precise mode
  const newHue = ((hsl.h + degrees) % 360 + 360) % 360;
  return hslToHex({ h: newHue, s: hsl.s, l: hsl.l });
}

// Helper to get hue from hex
function getHue(hex: string): number {
  return hexToHSL(hex, true).h;
}

describe("ColorTheory - Pure Color Rotations", () => {
  const BASE_COLOR = "#007DB8";
  const BASE_HUE = 199.24; // approximately

  describe("hexToHSL precision", () => {
    it("should parse #007DB8 to correct HSL values", () => {
      const hsl = hexToHSL(BASE_COLOR, true);
      expect(hsl.h).toBeCloseTo(199.24, 1);
      expect(hsl.s).toBeCloseTo(100, 1);
      expect(hsl.l).toBeCloseTo(36.08, 1);
    });
  });

  describe("Complementary (+180°)", () => {
    it("should produce #B83B00 for pure complementary of #007DB8", () => {
      const result = rotateHue(BASE_COLOR, 180);
      expect(result.toUpperCase()).toBe("#B83B00");
    });

    it("should have hue rotated exactly 180°", () => {
      const resultHue = getHue(rotateHue(BASE_COLOR, 180));
      const expectedHue = (BASE_HUE + 180) % 360;
      expect(resultHue).toBeCloseTo(expectedHue, 1);
    });
  });

  describe("Triadic (+120° and +240°)", () => {
    it("should produce #B8007D for +120° rotation", () => {
      const result = rotateHue(BASE_COLOR, 120);
      expect(result.toUpperCase()).toBe("#B8007D");
    });

    it("should produce #7DB800 for +240° rotation", () => {
      const result = rotateHue(BASE_COLOR, 240);
      expect(result.toUpperCase()).toBe("#7DB800");
    });

    it("triadic colors should be evenly spaced (120° apart)", () => {
      const hue1 = getHue(rotateHue(BASE_COLOR, 120));
      const hue2 = getHue(rotateHue(BASE_COLOR, 240));

      // Distance from base to hue1 should be 120°
      expect((hue1 - BASE_HUE + 360) % 360).toBeCloseTo(120, 1);
      // Distance from hue1 to hue2 should also be 120°
      expect((hue2 - hue1 + 360) % 360).toBeCloseTo(120, 1);
    });
  });

  describe("Analogous (+30° and -30°)", () => {
    it("should produce #0021B8 for +30° rotation", () => {
      const result = rotateHue(BASE_COLOR, 30);
      expect(result.toUpperCase()).toBe("#0021B8");
    });

    it("should produce #00B897 for -30° rotation", () => {
      const result = rotateHue(BASE_COLOR, -30);
      expect(result.toUpperCase()).toBe("#00B897");
    });

    it("analogous colors should be 30° apart from base", () => {
      const huePlus = getHue(rotateHue(BASE_COLOR, 30));
      const hueMinus = getHue(rotateHue(BASE_COLOR, -30));

      expect((huePlus - BASE_HUE + 360) % 360).toBeCloseTo(30, 1);
      expect((BASE_HUE - hueMinus + 360) % 360).toBeCloseTo(30, 1);
    });
  });

  describe("Monochromatic (same hue, different L)", () => {
    // User provided these as monochromatic variations
    const MONO_COLORS = ["#006C9F", "#007DB8", "#008ED2"];

    it("all monochromatic colors should have the same hue (±2°)", () => {
      const hues = MONO_COLORS.map((c) => getHue(c));
      const avgHue = hues.reduce((a, b) => a + b, 0) / hues.length;

      hues.forEach((hue) => {
        expect(Math.abs(hue - avgHue)).toBeLessThan(2);
      });
    });

    it("monochromatic colors should have different lightness", () => {
      const lightnesses = MONO_COLORS.map((c) => hexToHSL(c, true).l);
      // All should be different
      const unique = new Set(lightnesses.map((l) => Math.round(l)));
      expect(unique.size).toBe(3);
    });
  });
});

describe("ColorTheory - Round-trip Conversion", () => {
  const TEST_COLORS = [
    "#007DB8", // Blue
    "#B83B00", // Orange (complementary)
    "#FF0000", // Pure red
    "#00FF00", // Pure green
    "#0000FF", // Pure blue
    "#FFFFFF", // White
    "#000000", // Black
    "#808080", // Gray
  ];

  it.each(TEST_COLORS)(
    "hex→HSL→hex round-trip should preserve %s",
    (hex) => {
      const hsl = hexToHSL(hex, true);
      const result = hslToHex(hsl);
      expect(result.toUpperCase()).toBe(hex.toUpperCase());
    }
  );
});

describe("getAllHarmonyColors", () => {
  const BASE_COLOR = "#007DB8";

  describe("complementary scheme", () => {
    it("should return 1 color for complementary", () => {
      const result = getAllHarmonyColors(BASE_COLOR, "complementary", true);
      expect(result.colors).toHaveLength(1);
    });

    it("pure complementary should be #B83B00", () => {
      const result = getAllHarmonyColors(BASE_COLOR, "complementary", true);
      expect(result.colors[0].hex.toUpperCase()).toBe("#B83B00");
    });
  });

  describe("triadic scheme", () => {
    it("should return 2 colors for triadic", () => {
      const result = getAllHarmonyColors(BASE_COLOR, "triadic", true);
      expect(result.colors).toHaveLength(2);
    });

    it("pure triadic should include #B8007D (+120°) and #7DB800 (+240°)", () => {
      const result = getAllHarmonyColors(BASE_COLOR, "triadic", true);
      const hexes = result.colors.map((c) => c.hex.toUpperCase());
      expect(hexes).toContain("#B8007D");
      expect(hexes).toContain("#7DB800");
    });

    it("should have a recommendedIndex", () => {
      const result = getAllHarmonyColors(BASE_COLOR, "triadic", true);
      expect(result.recommendedIndex).toBeGreaterThanOrEqual(0);
      expect(result.recommendedIndex).toBeLessThan(result.colors.length);
    });
  });

  describe("analogous scheme", () => {
    it("should return 2 colors for analogous", () => {
      const result = getAllHarmonyColors(BASE_COLOR, "analogous", true);
      expect(result.colors).toHaveLength(2);
    });

    it("pure analogous should include #0021B8 (+30°) and #00B897 (-30°)", () => {
      const result = getAllHarmonyColors(BASE_COLOR, "analogous", true);
      const hexes = result.colors.map((c) => c.hex.toUpperCase());
      expect(hexes).toContain("#0021B8");
      expect(hexes).toContain("#00B897");
    });
  });

  describe("monochromatic scheme", () => {
    it("should return 3 colors for monochromatic", () => {
      const result = getAllHarmonyColors(BASE_COLOR, "monochromatic", true);
      expect(result.colors).toHaveLength(3);
    });

    it("all monochromatic colors should have similar hue", () => {
      const result = getAllHarmonyColors(BASE_COLOR, "monochromatic", true);
      const hues = result.colors.map((c) => hexToHSL(c.hex, true).h);
      const avgHue = hues.reduce((a, b) => a + b, 0) / hues.length;
      hues.forEach((hue) => {
        expect(Math.abs(hue - avgHue)).toBeLessThan(2);
      });
    });
  });

  describe("optimized vs pure mode", () => {
    it("optimized mode should produce different results than pure mode", () => {
      const pure = getAllHarmonyColors(BASE_COLOR, "complementary", true);
      const optimized = getAllHarmonyColors(BASE_COLOR, "complementary", false);

      // They should be different due to tone preservation
      expect(pure.colors[0].hex).not.toBe(optimized.colors[0].hex);
    });
  });
});
