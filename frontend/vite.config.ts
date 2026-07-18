/// <reference types="vitest/config" />

import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import remarkGfm from "remark-gfm";
import vike from "vike/plugin";
import { defineConfig } from "vite";

const mdxPlugin = { enforce: "pre" as const, ...mdx({ include: /\.mdx$/, remarkPlugins: [remarkGfm] }) };
const transformMdx = mdxPlugin.transform;

// @mdx-js/rollup strips query strings before filtering, so let Vite handle explicit raw imports.
mdxPlugin.transform = function transform(value, id) {
  if (id.endsWith("?raw")) return Promise.resolve(undefined);
  return transformMdx.call(this, value, id);
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [vike(), mdxPlugin, react({ include: /\.(js|jsx|mdx|ts|tsx)$/ })],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.component.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
