import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { queryClient, queryUtils, trpc, trpcClient } from "./trpcClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    queryUtils,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>,
);

const tauriInit = async () => {
  if (!import.meta.env.VITE_TAURI) return;
  const { attachConsole } = await import("@tauri-apps/plugin-log");

  await attachConsole();
  await tauriUpdate();
};

const tauriUpdate = async () => {
  const { check } = await import("@tauri-apps/plugin-updater");
  const update = await check();
  if (update?.available) {
    console.log(
      `Update to ${update.version} from ${update.currentVersion} available. Downloading and installing...`,
    );
    await update.downloadAndInstall();
    console.log("Update installed. Relaunching...");
    const { relaunch } = await import("@tauri-apps/plugin-process");
    await relaunch();
  } else {
    console.log("No update available.");
  }
};

tauriInit();
