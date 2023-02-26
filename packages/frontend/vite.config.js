"use strict";
exports.__esModule = true;
var vite_1 = require("vite");
var plugin_react_swc_1 = require("@vitejs/plugin-react-swc");
var rollup_plugin_visualizer_1 = require("rollup-plugin-visualizer");
var vite_tsconfig_paths_1 = require("vite-tsconfig-paths");
var vite_plugin_pwa_1 = require("vite-plugin-pwa");
// https://vitejs.dev/config/
exports["default"] = (0, vite_1.defineConfig)({
    plugins: [
        (0, vite_tsconfig_paths_1["default"])({ projects: ["tsconfig.json"] }),
        (0, plugin_react_swc_1["default"])(),
        (0, vite_plugin_pwa_1.VitePWA)({
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
                        purpose: "any maskable"
                    },
                    {
                        src: "/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png"
                    },
                ]
            }
        }),
        (0, rollup_plugin_visualizer_1.visualizer)({
            template: "treemap"
        }),
    ],
    server: {
        port: 4000
    }
});
