import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import { createApp } from "vinxi";
import { config } from "vinxi/plugins/config";
import { apiRouter } from "@vinxi/router/api";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     TanStackRouterVite({
//       routesDirectory: "./src/pages",
//     }),
//     react(),
//     viteTsconfigPaths({
//       projects: ["./tsconfig.json"],
//     }),
//     VitePWA({
//       registerType: "autoUpdate",
//       workbox: {
//         globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
//         navigateFallbackDenylist: [/^\/api/],
//         runtimeCaching: [
//           {
//             urlPattern: ({ url }) => url.pathname.startsWith("/api"),
//             handler: "NetworkOnly",
//             options: {
//               cacheName: "api-cache",
//             },
//           },
//         ],
//       },
//     }),
//   ],

//   clearScreen: false,
//   server: {
//     port: 1420,
//     host: true,
//     proxy: {
//       "/api": {
//         target: "http://127.0.0.1:3000",
//         changeOrigin: true,
//       },
//     },
//   },
// });

export default createApp({
  routers: [
    {
      name: "public",
      type: "static",
      dir: "./public",
    },
    {
      name: "client",
      type: "spa",
      handler: "./index.html",

      base: "/",
      plugins: () => [
        TanStackRouterVite({
          routesDirectory: "./src/pages",
        }),
        react(),
        viteTsconfigPaths({
          projects: ["./tsconfig.json"],
        }),
        dts({
          insertTypesEntry: true,
          include: "./src/api/**/*.ts",
          outDir: "dist/types",
        }),
      ],
    },
    {
      name: "api",
      type: "http",
      base: "/api",
      handler: "./src/api/hono.ts",
      plugins: () => [
        viteTsconfigPaths({
          projects: ["./tsconfig.json"],
        }),
      ],
      target: "server",
    },
  ],
  server: {
    experimental: {
      asyncContext: true,
    },
  },
});
