import { LinkMenuItem } from "@/components/LinkMenuItem";
import { MenuList } from "@mui/material";
import {} from "@tanstack/react-router";

export const Route = createFileRoute({
  head: () => ({
    meta: [
      {
        title: "Admin",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MenuList>
      <LinkMenuItem to="/admin/users">Users</LinkMenuItem>
      <LinkMenuItem to="/admin/api-keys">API Keys</LinkMenuItem>
      <LinkMenuItem to="/admin/event-parsing">Roles</LinkMenuItem>
    </MenuList>
  );
}
