import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3001",
  },
  webServer: {
    command: "pnpm build && pnpm preview --port 3001",
    url: "http://localhost:3001",
  },
});
