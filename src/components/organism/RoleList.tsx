import { useRoles } from "@/hooks/bot";
import { Spinner, Stack, Tag } from "@chakra-ui/react";

export default function RoleList() {
  const roles = useRoles();

  if (!roles.isSuccess) return <Spinner />;

  return (
    <Stack>
      {roles.data.map((role) => (
        <Tag>{role.name}</Tag>
      ))}
    </Stack>
  );
}
