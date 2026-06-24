import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import vike from "vike/plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vike(), react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
