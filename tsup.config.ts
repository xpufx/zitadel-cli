import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    cli: "src/cli/index.ts",
    core: "src/core/index.ts",
    transport: "src/transport/index.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
});
