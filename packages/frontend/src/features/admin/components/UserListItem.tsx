import { Button, ListItem, ListItemText } from "@mui/material";
import LinkBehavior from "../../../utils/LinkBehavior";
import { z } from "zod";
import { UserSchema } from "@team3132/attendance-backend/schema";

interface UserListItemProps {
  user: z.infer<typeof UserSchema>;
}

export default function UserListItem({ user }: UserListItemProps) {
  return (
    <ListItem>
      <ListItemText primary={user.username} />
      <Button
        variant="outlined"
        LinkComponent={LinkBehavior}
        href={`/user/${user.id}`}
      >
        Settings
      </Button>
    </ListItem>
  );
}
