import { defineConfig } from 'tsup';

export default defineConfig(({ watch }) => ({
  entry: ['src/main.ts', 'src/drizzle/migrations'],
  splitting: true,
  format: ['esm'],
  dts: true,
  bundle: true,
  clean: true,
  sourcemap: true,
  // target: 'esnext',
  onSuccess: watch
    ? 'node --enable-source-maps dist/main.js --inspect'
    : undefined,
  loader: {
    '.sql': 'copy',
    '.json': 'copy',
  },
  publicDir: 'public',
}));
