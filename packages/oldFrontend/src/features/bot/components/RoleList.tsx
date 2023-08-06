import { Spinner, Tag, Wrap } from "@chakra-ui/react";
import useRoles from "../hooks/useRoles";

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
