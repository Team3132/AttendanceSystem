import { getGlobalStartContext } from "@tanstack/react-start";

export function getServerContext() {
  const context = getGlobalStartContext();

  if (!context) throw new Error("No context, called on client");

  return context;
}
