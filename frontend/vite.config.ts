/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vike(), react()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.component.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
