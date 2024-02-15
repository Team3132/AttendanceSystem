import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, trpc, trpcClient } from "./trpcClient";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
);
