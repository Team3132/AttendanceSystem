import { useQuery } from "@tanstack/react-query";
import userApi from "../../../api/query/user.api";
import { List, Typography } from "@mui/material";
import UserListItem from "./UserListItem";

export default function UserList() {
  const usersQuery = useQuery(userApi.getUsers);

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
