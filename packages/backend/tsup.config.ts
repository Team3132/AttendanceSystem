import { defineConfig } from 'tsup';

export default defineConfig(({ watch }) => ({
  entry: ['src/main.ts'],
  splitting: true,
  format: ['cjs'],
  dts: false,
  bundle: true,
  clean: true,
  sourcemap: true,
  // target: 'esnext',
  onSuccess: watch
    ? 'node --enable-source-maps dist/src/main.js --inspect'
    : undefined,
  loader: {
    '.sql': 'copy',
    '.json': 'copy',
  },
  publicDir: 'public',
}));
