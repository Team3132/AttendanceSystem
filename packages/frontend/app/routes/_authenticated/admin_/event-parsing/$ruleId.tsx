import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/admin_/event-parsing/$ruleId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/admin_/event-parsing/$ruleId"!</div>;
}
