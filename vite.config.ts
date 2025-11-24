// import { defineConfig } from "@tanstack/react-start/config";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

const ReactCompilerConfig = {
  target: "19",
};

export default defineConfig({
  plugins: [
    viteTsconfigPaths(),
    tanstackStart(),
    nitro({ preset: "bun" }),
    viteReact({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
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
    }),
  ],
  server: {
    port: 1420,
  },
  ssr: !import.meta.dev
    ? {
        noExternal: ["@mui/*"],
      }
    : undefined,
  nitro: {
    routeRules: {
      "/assets/**": {
        static: true,
        headers: {
          "cache-control": `public, max-age=${365 * 24 * 60 * 60}, immutable`, // 1 year
        },
      },
    },
  },
});
