import { createFileRoute } from "@tanstack/react-router";
import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const SerializableErrorSchema = z.object({
  message: fallback(z.string().default("Unknown error"), "Unknown error"),
});

export const Route = createFileRoute("/error")({
  validateSearch: SerializableErrorSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { message } = Route.useSearch();
  return <div>{message}</div>;
}
