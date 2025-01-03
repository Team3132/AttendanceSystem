import viteTsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import { defineConfig } from "@tanstack/start/config";

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

// export default createApp({
//   routers: [
//     {
//       name: "public",
//       type: "static",
//       dir: "./public",
//     },
//     {
//       name: "client",
//       type: "spa",
//       handler: "./index.html",

//       base: "/",
//       plugins: () => [
//         TanStackRouterVite({
//           routesDirectory: "./src/pages",
//         }),
//         react(),
//         viteTsconfigPaths({
//           projects: ["./tsconfig.json"],
//         }),
//         dts({
//           insertTypesEntry: true,
//           include: "./src/api/**/*.ts",
//           outDir: "dist/types",
//         }),
//       ],
//     },
//     {
//       name: "api",
//       type: "http",
//       base: "/api",
//       handler: "./src/api/hono.ts",
//       plugins: () => [
//         viteTsconfigPaths({
//           projects: ["./tsconfig.json"],
//         }),
//       ],
//       target: "server",
//     },
//   ],
//   server: {
//     experimental: {
//       asyncContext: true,
//     },
//   },
// });

export default defineConfig({
  vite: {
    plugins: [
      viteTsconfigPaths(),
      dts({
        insertTypesEntry: true,
        include: "./app/api/**/*.ts",
        outDir: "dist/types",
      }),
    ],
    ssr: !import.meta.dev
      ? {
          noExternal: ["@mui/*"],
        }
      : undefined,
  },
  server: {
    experimental: {
      openAPI: true,
    },
    openAPI: {
      production: "runtime",
      route: "/_docs/openapi.json",
      ui: {
        scalar: {
          route: "/_docs/scalar",
        },
        swagger: {
          route: "/_docs/swagger",
        },
      },
    },
  },
});