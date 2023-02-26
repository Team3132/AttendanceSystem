import { defineConfig } from 'tsup';

export default defineConfig(({ watch }) => ({
  entryPoints: ['src/main.ts'],
  splitting: true,
  format: ['cjs'],
  dts: false,
  bundle: true,
  clean: true,
  sourcemap: true,
  minify: !watch,
  // target: 'esnext',
  onSuccess: watch
    ? 'node --enable-source-maps dist/main.js --inspect'
    : undefined,
}));
