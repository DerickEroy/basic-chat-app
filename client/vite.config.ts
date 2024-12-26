import react from "@vitejs/plugin-react";
import { defineConfig as defineViteConfig, mergeConfig } from "vite";
import { defineConfig as defineVitestConfig } from "vitest/config";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
const viteConfig = defineViteConfig({
  plugins: [react(), TanStackRouterVite()],
});

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.ts",
  },
});

export default mergeConfig(viteConfig, vitestConfig);
