import { createFileRoute } from "@tanstack/react-router";
import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const SerializableErrorSchema = z.object({
  message: fallback(z.string(), "Unknown error").default("Unknown error"),
  stack: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/error")({
  validateSearch: SerializableErrorSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { message, stack } = Route.useSearch();
  return <div>{message}</div>;
}
