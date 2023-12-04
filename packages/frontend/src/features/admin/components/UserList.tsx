import { List, Typography } from "@mui/material";
import UserListItem from "./UserListItem";
import { trpc } from "../../../utils/trpc";

export default function UserList() {
  const usersQuery = trpc.users.getUserList.useQuery();

  if (usersQuery.data) {
    return (
      <List>
        {usersQuery.data.map((user) => (
          <UserListItem user={user} key={user.id} />
        ))}
      </List>
    );
  }

  if (usersQuery.isError) {
    return <Typography>Error loading users</Typography>;
  }

  return <Typography>Loading users...</Typography>;
}
