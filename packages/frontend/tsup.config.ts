import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["app/server/index.ts"],
  format: ["esm"],
  splitting: false,
  // sourcemap: true,
  clean: true,
  dts: true,
});
