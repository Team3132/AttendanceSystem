import { defineConfig } from "@tanstack/start/config";
import { visualizer } from "rollup-plugin-visualizer";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  react: {
    babel: {
      plugins: [
        [
          "@emotion/babel-plugin",
          {
            importMap: {
              "@mui/system": {
                styled: {
                  canonicalImport: ["@emotion/styled", "default"],
                  styledBaseImport: ["@mui/system", "styled"],
                },
              },
              "@mui/material": {
                styled: {
                  canonicalImport: ["@emotion/styled", "default"],
                  styledBaseImport: ["@mui/material", "styled"],
                },
              },
              "@mui/material/styles": {
                styled: {
                  canonicalImport: ["@emotion/styled", "default"],
                  styledBaseImport: ["@mui/material/styles", "styled"],
                },
              },
            },
          },
        ],
      ],
    },
  },
  server: {
    // breaks cloudflare cdn caching
    routeRules: {
      "/_build/assets/**": {
        headers: {
          "cache-control": "public, max-age=31536000, immutable",
        },
      },
    },
    analyze: {
      emitFile: true,
    },
  },
  vite: {
    plugins: [viteTsconfigPaths(), visualizer({ emitFile: true })],
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
