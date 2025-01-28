import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import { VitePluginNode } from "vite-plugin-node";
// @ts-ignore
import { dynamicAliases } from "../../scripts/getViteAliases.js";

export default defineConfig({
  // plugins: [swc(), viteTsconfigPaths(), externalizeDeps()],
  resolve: {
    alias: dynamicAliases,
  },
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
