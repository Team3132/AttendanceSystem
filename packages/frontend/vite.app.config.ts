import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: "src/server/index.ts",
      name: "frontend",
      formats: ["es", "cjs"],
    },
  },
  plugins: [viteTsconfigPaths(), dts()],
});
