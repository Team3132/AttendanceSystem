import { useRoles } from "@/hooks/bot";
import { Spinner, Tag, Wrap } from "@chakra-ui/react";

export default function RoleList() {
  const roles = useRoles();

  if (!roles.isSuccess) return <Spinner />;

  return (
    <Wrap justify={"center"}>
      {roles.data.map((role) => (
        <Tag colorScheme={"blue"}>{role.name}</Tag>
      ))}
    </Wrap>
  );
}
