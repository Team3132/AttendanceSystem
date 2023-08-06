import { useQuery } from "@tanstack/react-query";
import botApi from "../api/query/bot.api";

interface RoleTextProps {
  roleId: string;
}

export default function RoleText({ roleId }: RoleTextProps) {
  const rolesQuery = useQuery(botApi.getRoles);

  if (rolesQuery.data) {
    const role = rolesQuery.data.find((role) => role.id === roleId);

    if (role) {
      return <span>{role.name}</span>;
    } else {
      return <span>{roleId}</span>;
    }
  }

  return <span>"Loading..."</span>;
}
