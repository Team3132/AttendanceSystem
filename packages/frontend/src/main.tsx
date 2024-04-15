import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const tauriUpdate = async () => {
  return;
  // biome-ignore lint/correctness/noUnreachable: disabled for now
  if (!import.meta.env.VITE_TAURI) return;

  const { check } = await import("@tauri-apps/plugin-updater");
  const { relaunch } = await import("@tauri-apps/plugin-process");
  const update = await check();
  if (update?.available) {
    console.log("Update available. Downloading and installing...");
    await update.downloadAndInstall();
    console.log("Update installed. Relaunching...");
    await relaunch();
  } else {
    console.log("No update available.");
  }
};

tauriUpdate();
