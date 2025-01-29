import { defineConfig } from "vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import { VitePluginNode } from "vite-plugin-node";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    ...VitePluginNode({
      adapter: "nest",
      appPath: "src/main.ts",
      tsCompiler: "swc",
    }),
    viteTsconfigPaths(),
    externalizeDeps(),
  ],
  build: {
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
    },
  },
  server: {
    port: 3001,
  },
});
