import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// ─── TWEAK THESE TO TRY DIFFERENT PALETTES ───────────────────────────────────
export const COLORS = {
  pageBg: "#0d1410", // page / body background   oklch(0.09, 0.006, 145)
  cardBgMuted: "#141e15", // subtle surfaces / inputs oklch(0.13, 0.008, 145)
  cardBg: "#1c2b1e", // Card.Root panels         oklch(0.18, 0.010, 145)
  border: "#2c4230", // card / component borders oklch(0.28, 0.014, 145)
  accent: "green", // Chakra colorPalette name for badges, buttons
};
// ─────────────────────────────────────────────────────────────────────────────

const config = defineConfig({
  globalCss: {
    // ponytail: stops Chromium mobile from bouncing at scroll edges, which triggers toolbar flicker
    body: { overscrollBehaviorY: "contain" },
  },
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { _light: "white", _dark: COLORS.pageBg } },
          panel: { value: { _light: "white", _dark: COLORS.cardBg } },
          muted: { value: { _light: "{colors.gray.100}", _dark: COLORS.cardBgMuted } },
        },
        border: {
          DEFAULT: { value: { _light: "{colors.gray.200}", _dark: COLORS.border } },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
