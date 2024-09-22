import { defineConfig } from "tsup";

export default defineConfig(({ watch }) => ({
  entry: ["src/index.ts", "src/schema/index.ts", "src/services/index.ts"],
  splitting: true,
  format: ["esm"],
  dts: true,
  bundle: true,
  clean: true,
  sourcemap: true,
  // target: 'esnext',
  onSuccess: watch
    ? "node --enable-source-maps dist/index.js --inspect"
    : undefined,
  loader: {
    ".sql": "copy",
    ".json": "copy",
  },
  publicDir: "public",
  tsconfig: "tsconfig.json",
}));
