import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// ─── TWEAK THESE TO TRY DIFFERENT PALETTES ───────────────────────────────────
// Light theme only: two brand colors plus tints. Use plain values (not { base }) so they
// replace Chakra's light/dark defaults instead of merging under them.
export const LIME = "#b5e45e";
export const DARK_GREEN = "#0c2e16";

const PALETTE = {
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

/** sRGB of PALETTE.bg. Safari theme-color cannot use oklch or CSS variables. */
export const THEME_COLOR = "#fbffff";

/** CSS variables of the theme colors (prefer these over hardcoded oklch). */
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
      colorScheme: "light",
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
          DEFAULT: { value: PALETTE.bg },
          panel: { value: PALETTE.surfaceMuted },
          muted: { value: PALETTE.surfaceMuted },
        },
        text: { value: PALETTE.text },
        accent: { value: PALETTE.accent },
        accentFg: { value: PALETTE.accentFg },
        borderColor: { value: PALETTE.border },
        surfaceMuted: { value: PALETTE.surfaceMuted },
        onAccent: { value: PALETTE.onAccent },
        toastBg: { value: PALETTE.accentFg },
        toastFg: { value: LIME },
        border: {
          // Keep Chakra's default border (gray.200 / gray.800) for Select, Input, and other outline controls.
          subtle: { value: PALETTE.borderSubtle },
        },
        fg: {
          DEFAULT: { value: "{colors.text}" },
          accent: { value: "{colors.accentFg}" },
          muted: { value: PALETTE.muted },
        },
        // Chakra's Link (and other gray-colorPalette defaults) reads gray.fg, not fg.DEFAULT.
        gray: {
          fg: { value: "{colors.text}" },
        },
        // Lime surfaces (landing hero CTA, PageIntro) with dark green text.
        heroButton: {
          bg: { value: LIME },
          fg: { value: DARK_GREEN },
        },
        // Chart/status fills — ≥3:1 vs page bg.
        viz: {
          field: { value: DARK_GREEN },
          school: { value: "oklch(0.55 0.072 214)" },
          sector: { value: "oklch(0.55 0.108 46)" },
          trend: { value: "oklch(0.55 0.098 101)" },
          ylituotos: { value: "oklch(0.55 0.14 55)" },
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
