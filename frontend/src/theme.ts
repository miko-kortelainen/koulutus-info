import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// ─── TWEAK THESE TO TRY DIFFERENT PALETTES ───────────────────────────────────
// One restrained hue plus role-specific shades. Dark values are tuned (not mirrored).
// Use _light/_dark (not base) so values replace Chakra defaults instead of merging under them.
export const LIME = "#b5e45e";
export const DARK_GREEN = "#0c2e16";

const LIGHT = {
  bg: "oklch(0.997 0.004 197.089)", // white page/card bg
  text: DARK_GREEN,
  accent: DARK_GREEN,
  accentFg: DARK_GREEN,
  border: `color-mix(in srgb, ${DARK_GREEN} 75%, transparent)`,
  surfaceMuted: "oklch(0.965 0.002 17.636)", // solid — portaled overlays must not be see-through
  muted: `color-mix(in srgb, ${DARK_GREEN} 75%, transparent)`,
  borderSubtle: `color-mix(in srgb, ${DARK_GREEN} 50%, transparent)`,
  onAccent: LIME,
} as const;

const DARK = {
  bg: DARK_GREEN,
  text: LIME,
  accent: LIME,
  accentFg: LIME,
  border: `color-mix(in srgb, ${LIME} 40%, transparent)`,
  surfaceMuted: "oklch(0.24 0.006 17.636)",
  muted: `color-mix(in srgb, ${LIME} 80%, transparent)`,
  borderSubtle: `color-mix(in srgb, ${LIME} 45%, transparent)`,
  onAccent: DARK_GREEN,
} as const;

/** sRGB of LIGHT.bg / DARK.bg. Safari theme-color cannot use oklch or CSS variables. */
export const THEME_COLOR = {
  light: "#fbffff",
  dark: DARK_GREEN,
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
      backgroundColor: "bg",
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
        toastBg: { value: LIGHT.accentFg },
        toastFg: { value: LIME },
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
        // Landing hero CTA: leaf green with dark green text in both themes.
        heroButton: {
          bg: { value: LIME },
          fg: { value: DARK_GREEN },
        },
        // Chart/status fills — appearance-tuned for ≥3:1 vs page bg.
        viz: {
          field: { value: { _light: DARK_GREEN, _dark: LIME } },
          school: { value: { _light: "oklch(0.55 0.072 214)", _dark: "oklch(0.75 0.072 214)" } },
          sector: { value: { _light: "oklch(0.55 0.108 46)", _dark: "oklch(0.75 0.108 46)" } },
          trend: { value: { _light: "oklch(0.55 0.098 101)", _dark: "oklch(0.75 0.098 101)" } },
          ylituotos: { value: { _light: "oklch(0.55 0.14 55)", _dark: "oklch(0.75 0.14 55)" } },
        },
        // Application pressure tier badge tokens.
        tier: {
          lowBg: { value: "oklch(0.376 0.077 159.44)" },
          mediumBg: { value: "oklch(0.476 0.128 39.44)" },
          highBg: { value: "oklch(0.376 0.113 13.636)" },
          fg: { value: "oklch(1 0 0)" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
