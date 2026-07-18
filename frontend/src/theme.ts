import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// ─── TWEAK THESE TO TRY DIFFERENT PALETTES ───────────────────────────────────
// One restrained hue plus role-specific shades and alpha-derived neutrals.
export const COLORS = {
  bg: "oklch(0.997 0.004 197.089)", // white page/card bg
  text: "oklch(0.266 0.008 17.636)", // dark grey/near-black — text, borders, icons
  accent: "oklch(0.713 0.156 126.033)", // the one accent — CTAs/badges/highlights only
  accentFg: "oklch(0.713 0.13 126.033)", // contrast-safe accent for text, icons, and outlines

  // Derived neutrals: shades of `text`, not new hues.
  border: "oklch(0.266 0.008 17.636 / 0.75)", // controls and other meaningful boundaries
  surfaceMuted: "oklch(0.965 0.002 17.636)", // solid — used by portaled overlays (Select, Menu, Tooltip), must not be see-through
};
// ─────────────────────────────────────────────────────────────────────────────

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Google Sans Flex', sans-serif" },
        body: { value: "'Google Sans Flex', sans-serif" },
      },
      colors: {
        bg: { value: COLORS.bg },
        text: { value: COLORS.text },
        accent: { value: COLORS.accent },
        accentFg: { value: COLORS.accentFg },
        borderColor: { value: COLORS.border },
        surfaceMuted: { value: COLORS.surfaceMuted },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          panel: { value: "{colors.surfaceMuted}" },
          muted: { value: "{colors.surfaceMuted}" },
        },
        border: {
          subtle: { value: "{colors.borderSubtle}" },
        },
        fg: {
          DEFAULT: { value: "{colors.text}" },
          accent: { value: "{colors.accentFg}" },
          muted: { value: "oklch(0.266 0.008 17.636 / 0.72)" },
        },
        // Chakra's Link (and other gray-colorPalette defaults) reads gray.fg, not fg.DEFAULT.
        gray: {
          fg: { value: "{colors.text}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
