import { useQuery } from "@tanstack/react-query";
import botApi from "../api/query/bot.api";
import { Chip } from "@mui/material";

interface RoleTextProps {
  roleId: string;
}

export default function RoleChip({ roleId }: RoleTextProps) {
  const rolesQuery = useQuery(botApi.getRoles);

  if (rolesQuery.data) {
    const role = rolesQuery.data.find((role) => role.id === roleId);

    if (role) {
      return (
        <Chip
          label={role.name}
          size="small"
          sx={{
            backgroundColor: `#${role.color.toString(16)}`,
            color: role.color > 0xffffff / 2 ? "black" : "white",
          }}
        />
      );
    } else {
      return <Chip label={roleId} size="small" />;
    }
  }

  return <Chip label="Loading..." size="small" />;
}
