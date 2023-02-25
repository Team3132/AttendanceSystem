import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        name: "TDU Attendance",
        short_name: "TDU",
        theme_color: "#1C3B1E",
        icons: [
          {
            src: "/maskable_icon.png",
            type: "image/png",
            sizes: "1024x1024",
            purpose: "any maskable",
          },
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    visualizer({
      template: "treemap", // "sunburst" | "treemap" | "network"
    }),
  ],
  server: {
    port: 4000,
    // https: {
    //   key: "./security/localhost.key",
    //   cert: "./security/localhost.crt",
    // },
  },
});
