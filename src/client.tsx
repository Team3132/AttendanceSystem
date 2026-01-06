// src/client.tsx
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

// @ts-ignore
if (window?.__TAURI__) {
  // const { fetch: tauriFetch } = await import("@tauri-apps/plugin-http");
  // @ts-ignore
  // window.fetch = tauriFetch;
  const { getCurrent } = await import("@tauri-apps/plugin-deep-link");

  const startUrls = await getCurrent();
  console.log(startUrls?.join(", "));
}

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
);
