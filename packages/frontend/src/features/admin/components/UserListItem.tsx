import { Button, ListItem, ListItemText } from "@mui/material";
import { User } from "../../../api/generated";
import LinkBehavior from "../../../utils/LinkBehavior";

interface UserListItemProps {
  user: User;
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
        Scancodes
      </Button>
    </ListItem>
  );
}
