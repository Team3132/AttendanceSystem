import DefaultAppBar from "@/components/DefaultAppBar";
import { LinkMenuItem } from "@/components/LinkMenuItem";
import { Container, MenuList } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin_/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DefaultAppBar title="Admin" />

      {/* Links */}
      <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
        <MenuList>
          <LinkMenuItem to="/admin/users">Users</LinkMenuItem>
          <LinkMenuItem to="/admin/api-keys">API Keys</LinkMenuItem>
          <LinkMenuItem to="/admin/event-parsing">Roles</LinkMenuItem>
        </MenuList>
      </Container>
    </>
  );
}
