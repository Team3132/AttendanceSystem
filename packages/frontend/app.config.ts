import { defineConfig } from "@tanstack/start/config";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    plugins: [viteTsconfigPaths()],
    ssr: !import.meta.dev
      ? {
          noExternal: ["@mui/*"],
        }
      : undefined,
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
