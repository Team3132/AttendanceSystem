import { StartClient } from "@tanstack/react-start";
// app/client.tsx
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(document, <StartClient router={router} />, {
  onRecoverableError: (error, errorInfo) => {
    console.error("Recoverable hydration error:", error);
    console.error(errorInfo);
  },
});
