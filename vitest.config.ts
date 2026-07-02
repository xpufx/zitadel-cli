import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    exclude: ["vendor/**", "node_modules/**"],
    include: ["src/**/*.test.ts"],
  },
});
