import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// ─── TWEAK THESE TO TRY DIFFERENT PALETTES ───────────────────────────────────
// Exactly 3 base colors + alpha-derived neutrals (no new hues).
export const COLORS = {
  bg: "oklch(0.997 0.004 197.089)", // white page/card bg
  text: "oklch(0.266 0.008 17.636)", // dark grey/near-black — text, borders, icons
  accent: "oklch(0.713 0.156 126.033)", // the one accent — CTAs/badges/highlights only

  // Derived neutrals: shades of `text`, not new hues.
  border: "oklch(0.266 0.008 17.636 / 0.16)", // hairline borders (composited on a solid bg, alpha is fine)
  surfaceMuted: "oklch(0.965 0.002 17.636)", // solid — used by portaled overlays (Select, Menu, Tooltip), must not be see-through
};
// ─────────────────────────────────────────────────────────────────────────────

const config = defineConfig({
  globalCss: {
    // ponytail: stops mobile bounce at scroll edges, which triggers toolbar flicker (Chromium via body, WebKit via html)
    html: { overscrollBehaviorY: "contain" },
    body: { overscrollBehaviorY: "contain" },
  },
  theme: {
    tokens: {
      colors: {
        bg: { value: COLORS.bg },
        text: { value: COLORS.text },
        accent: { value: COLORS.accent },
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
          DEFAULT: { value: "{colors.borderColor}" },
        },
        fg: {
          DEFAULT: { value: "{colors.text}" },
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
