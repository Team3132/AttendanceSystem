import viteTsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "@tanstack/start/config";

export default defineConfig({
  vite: {
    plugins: [viteTsconfigPaths()],
    ssr: !import.meta.dev
      ? {
          noExternal: ["@mui/*"],
        }
      : undefined,
  },
});
