import { List, Typography } from "@mui/material";
import UserListItem from "./UserListItem";
import { trpc } from "@/trpcClient";
import { z } from "zod";
import { UserSchema } from "backend/schema";

interface UserListProps {
  initialUserList: Array<z.infer<typeof UserSchema>>;
}

export default function UserList(props: UserListProps) {
  const { initialUserList } = props;

  const usersQuery = trpc.users.getUserList.useQuery(undefined, {
    initialData: initialUserList,
  });

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
