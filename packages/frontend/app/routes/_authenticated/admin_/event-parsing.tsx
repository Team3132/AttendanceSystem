import DefaultAppBar from "@/components/DefaultAppBar";
import { Container } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin_/event-parsing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DefaultAppBar title="Admin - Event Parsing" />
      <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}></Container>
    </>
  );
}
