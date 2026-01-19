// src/client.tsx
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { logger } from "./utils/logger";

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
);

logger.success("Loaded Client");
