import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// ─── TWEAK THESE TO TRY DIFFERENT PALETTES ───────────────────────────────────
// One restrained hue plus role-specific shades. Dark values are tuned (not mirrored).
// Use _light/_dark (not base) so values replace Chakra defaults instead of merging under them.
const LIGHT = {
  bg: "oklch(0.997 0.004 197.089)", // white page/card bg
  text: "oklch(0.266 0.008 17.636)", // dark grey/near-black — text, borders, icons
  accent: "oklch(0.65 0.156 126.033)", // CTA/badge fill — ≥3:1 vs bg with dark onAccent
  accentFg: "oklch(0.38 0.165 125.721)", // accent text/icons/outlines on light bg (≥4.5:1)
  border: "oklch(0.266 0.008 17.636 / 0.75)", // stronger outlines via COLORS.border / borderColor token
  surfaceMuted: "oklch(0.965 0.002 17.636)", // solid — portaled overlays must not be see-through
  muted: "oklch(0.266 0.008 17.636 / 0.72)",
  borderSubtle: "oklch(0.266 0.008 17.636 / 0.45)", // ≥3:1 blended vs bg (tracks, separators)
  onAccent: "oklch(0.266 0.008 17.636)", // text/icons on accent fills
} as const;

const DARK = {
  bg: "oklch(0.18 0.008 197)",
  text: "oklch(0.93 0.006 17.636)",
  accent: "oklch(0.72 0.14 126)",
  accentFg: "oklch(0.82 0.13 126)", // lighter for readable accent text/icons on dark bg
  border: "oklch(0.93 0.006 17.636 / 0.4)",
  surfaceMuted: "oklch(0.24 0.006 17.636)",
  muted: "oklch(0.82 0.006 17.636)", // raised L for muted copy on dark bg
  borderSubtle: "oklch(0.93 0.006 17.636 / 0.45)", // ≥3:1 blended vs bg (tracks, separators)
  onAccent: "oklch(0.22 0.008 17.636)", // stays dark on mid-green accent fills
} as const;

/** CSS variables that track the active appearance (prefer these over hardcoded oklch). */
export const COLORS = {
  bg: "var(--chakra-colors-bg)",
  text: "var(--chakra-colors-text)",
  accent: "var(--chakra-colors-accent)",
  accentFg: "var(--chakra-colors-accent-fg)",
  border: "var(--chakra-colors-border-color)",
  surfaceMuted: "var(--chakra-colors-surface-muted)",
  onAccent: "var(--chakra-colors-on-accent)",
} as const;
// ─────────────────────────────────────────────────────────────────────────────

const config = defineConfig({
  globalCss: {
    html: {
      colorScheme: "light dark",
    },
    body: {
      backgroundColor: "bg",
      color: "fg",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Google Sans Flex', sans-serif" },
        body: { value: "'Google Sans Flex', sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { _light: LIGHT.bg, _dark: DARK.bg } },
          panel: { value: { _light: LIGHT.surfaceMuted, _dark: DARK.surfaceMuted } },
          muted: { value: { _light: LIGHT.surfaceMuted, _dark: DARK.surfaceMuted } },
        },
        text: { value: { _light: LIGHT.text, _dark: DARK.text } },
        accent: { value: { _light: LIGHT.accent, _dark: DARK.accent } },
        accentFg: { value: { _light: LIGHT.accentFg, _dark: DARK.accentFg } },
        borderColor: { value: { _light: LIGHT.border, _dark: DARK.border } },
        surfaceMuted: { value: { _light: LIGHT.surfaceMuted, _dark: DARK.surfaceMuted } },
        onAccent: { value: { _light: LIGHT.onAccent, _dark: DARK.onAccent } },
        border: {
          // Keep Chakra's default border (gray.200 / gray.800) for Select, Input, and other outline controls.
          subtle: { value: { _light: LIGHT.borderSubtle, _dark: DARK.borderSubtle } },
        },
        fg: {
          DEFAULT: { value: "{colors.text}" },
          accent: { value: "{colors.accentFg}" },
          muted: { value: { _light: LIGHT.muted, _dark: DARK.muted } },
        },
        // Chakra's Link (and other gray-colorPalette defaults) reads gray.fg, not fg.DEFAULT.
        gray: {
          fg: { value: "{colors.text}" },
        },
        // Chart/status fills — appearance-tuned for ≥3:1 vs page bg.
        viz: {
          field: { value: { _light: "oklch(0.55 0.13 132)", _dark: "oklch(0.75 0.13 132)" } },
          school: { value: { _light: "oklch(0.55 0.072 214)", _dark: "oklch(0.75 0.072 214)" } },
          sector: { value: { _light: "oklch(0.55 0.108 46)", _dark: "oklch(0.75 0.108 46)" } },
          trend: { value: { _light: "oklch(0.55 0.098 101)", _dark: "oklch(0.75 0.098 101)" } },
          ylituotos: { value: { _light: "oklch(0.55 0.14 55)", _dark: "oklch(0.75 0.14 55)" } },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
