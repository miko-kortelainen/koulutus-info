import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// ─── TWEAK THESE TO TRY DIFFERENT PALETTES ───────────────────────────────────
export const COLORS = {
  pageBg: "oklch(0.182 0.013 159.669)",
  cardBgMuted: "oklch(0.222 0.023 147.385)",
  cardBg: "oklch(0.271 0.031 148.127)",
  border: "oklch(0.355 0.042 149.518)",
  accent: "green", // Chakra colorPalette name for badges, buttons
  yellowGreen: "oklch(0.757 0.183 133)",
  ghostWhite: "oklch(0.97 0.007 281)",
  mintLeaf: "oklch(0.44 0.063 152.071)",
  honeyBronze: "oklch(0.821 0.148 68)",
};
// ─────────────────────────────────────────────────────────────────────────────

const config = defineConfig({
  globalCss: {
    // ponytail: stops Chromium mobile from bouncing at scroll edges, which triggers toolbar flicker
    body: { overscrollBehaviorY: "contain" },
  },
  theme: {
    tokens: {
      colors: {
        pageBg: { value: COLORS.pageBg },
        cardBg: { value: COLORS.cardBg },
        cardBgMuted: { value: COLORS.cardBgMuted },
        borderColor: { value: COLORS.border },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { _light: "white", _dark: "{colors.pageBg}" } },
          panel: { value: { _light: "white", _dark: "{colors.cardBg}" } },
          muted: { value: { _light: "{colors.gray.100}", _dark: "{colors.cardBgMuted}" } },
        },
        border: {
          DEFAULT: { value: { _light: "{colors.gray.200}", _dark: "{colors.borderColor}" } },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
