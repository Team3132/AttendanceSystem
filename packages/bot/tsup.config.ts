import { defineConfig } from "tsup";

export default defineConfig(({ watch }) => ({
  entry: ["src/main.ts"],
  splitting: true,
  format: ["esm"],
  dts: false,
  bundle: true,
  clean: true,
  sourcemap: true,
  // target: 'esnext',
  onSuccess: watch
    ? "node --enable-source-maps dist/main.js --inspect"
    : undefined,
  publicDir: "public",
  tsconfig: "tsconfig.json",
}));
