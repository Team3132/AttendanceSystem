import { Tag, TagProps } from "@chakra-ui/react";
import useRole from "../hooks/useRole";

export interface RoleTagProps extends TagProps {
  roleId: string;
}

export default function RoleTag({ roleId, ...rest }: RoleTagProps) {
  const { data: role } = useRole(roleId);
  return <Tag {...rest}>{role?.name}</Tag>;
}
