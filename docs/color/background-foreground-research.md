# Background/Foreground Color Research

Research findings for Rampkit's background and foreground color generation.

## Problem Statement

The OKLCH-based background generation was producing `#000102` (near pure black) instead of the expected `#0F0F0F` range for dark mode backgrounds.

## Root Cause

**The OKLCH lightness target was incorrectly calculated.**

| Reference Color | Actual OKLCH L | Code Target L | Error Factor |
|-----------------|----------------|---------------|--------------|
| `#0F0F0F` (production) | **0.1684** | 0.07 | 2.4× too dark |
| `#121212` (Material) | **0.1822** | 0.07 | 2.6× too dark |
| `#000102` (broken output) | 0.0633 | — | Result |

Additionally, at very low lightness (L < 0.10) with any chroma, colors often fall outside the sRGB gamut, causing clipping to near-black.

## Industry Guidelines

### Material Design (Google)
- **Baseline surface**: `#121212` (OKLCH L ≈ 0.182)
- **Elevated surfaces**: Use overlay white at varying opacities
- **Avoid pure black** (#000000) due to halation effects
- Source: [Material Design Dark Theme](https://m2.material.io/design/color/dark-theme.html)

### Apple Human Interface Guidelines
- Use **dark gray** backgrounds, not pure black
- Elevated surfaces should be distinguishable from base
- Pure black reserved for OLED true black mode (opt-in)
- Source: [Apple HIG Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)

### Radix UI Colors
- Step 1: App background (subtle)
- Step 2: Subtle component background
- Steps 11-12 guarantee **APCA Lc 60/90** contrast on Step 2
- Source: [Radix Understanding the Scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)

### UX Research on Pure Black
- **Halation effect**: Bright text on pure black appears to "glow" or bleed
- **OLED smearing**: Fast scrolling causes visible ghosting on AMOLED
- **Eye strain**: High contrast (21:1) fatigues eyes faster than 15:1
- **Recommendation**: Use `#121212` to `#1A1A1A` (dark gray)
- Sources:
  - [Atmos Dark Mode Best Practices](https://atmos.style/blog/dark-mode-ui-best-practices)
  - [Toptal Dark UIs](https://www.toptal.com/designers/ui/dark-ui)

## OKLCH Lightness Guidelines

### Correct Mappings
| Target | Hex Range | OKLCH L Range |
|--------|-----------|---------------|
| Dark background | `#0F0F0F` - `#1A1A1A` | **0.168 - 0.215** |
| Light background | `#F5F5F5` - `#FAFAFA` | **0.970 - 0.985** |
| Pure white | `#FFFFFF` | 1.000 |
| Pure black | `#000000` | 0.000 |

### Chroma Constraints
- **Backgrounds**: 0.005 - 0.015 (subtle tinting)
- At L < 0.10, most hue+chroma combinations fall outside sRGB gamut
- **Safe approach**: Use L ≥ 0.15 for any tinted dark background

## Recommended Values

### Dark Mode Background
```
OKLCH L: 0.17 - 0.20 (not 0.06-0.08!)
OKLCH C: 0.005 - 0.012 (very subtle)
OKLCH H: Derived from accent (or neutral)
Target HEX: #0F0F0F to #171717
```

### Light Mode Background
```
OKLCH L: 0.97 - 0.98
OKLCH C: 0.003 - 0.008
OKLCH H: Derived from accent
Target HEX: #F5F5F5 to #FAFAFA
```

### Foreground Guidelines
- **Dark mode text**: Off-white (`#E0E0E0` for body, `#FFFFFF` for headings)
- **Light mode text**: Near-black (`#1A1A1A` for body, `#000000` for headings)
- **WCAG AA minimum**: 4.5:1 contrast ratio
- **APCA target**: Lc 75+ for body text

## Implementation Notes

1. **Always clamp to sRGB gamut** after OKLCH conversion
2. **Verify output** is in expected range (`#0A0A0A` - `#1F1F1F` for dark)
3. **Reduce chroma** if gamut mapping produces unexpected results
4. **Test edge cases**: cyan, blue-violet hues are most prone to clipping

## References

- [Evil Martians OKLCH Article](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Material Design Dark Theme](https://m2.material.io/design/color/dark-theme.html)
- [Radix Colors Documentation](https://www.radix-ui.com/colors)
- [APCA Contrast Algorithm](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html)
- [WCAG Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
