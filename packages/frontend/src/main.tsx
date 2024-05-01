import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./trpcClient";

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

// const tauriInit = async () => {
//   if (!import.meta.env.VITE_TAURI) return;
//   const { attachConsole } = await import("@tauri-apps/plugin-log");

//   await attachConsole();
//   await tauriUpdate();
// };

// const tauriUpdate = async () => {
//   const { check } = await import("@tauri-apps/plugin-updater");
//   const update = await check();
//   if (update?.available) {
//     console.log(
//       `Update to ${update.version} from ${update.currentVersion} available. Downloading and installing...`,
//     );
//     await update.downloadAndInstall();
//     console.log("Update installed. Relaunching...");
//     const { relaunch } = await import("@tauri-apps/plugin-process");
//     await relaunch();
//   } else {
//     console.log("No update available.");
//   }
// };

// tauriInit();
