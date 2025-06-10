import { usersQueryOptions } from "@/queries/users.queries";
import { List, ListItem, ListItemText, Skeleton } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {} from "@tanstack/react-router";
import { DateTime } from "luxon";
import { Suspense } from "react";

export const Route = createFileRoute(
  "/_authenticated/admin_/users/$userId/sessions",
)({
  loader: ({ context: { queryClient }, params: { userId } }) => {
    queryClient.prefetchQuery(usersQueryOptions.userSessions(userId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense fallback={<SkeletonSessionList />}>
      <SessionList />
    </Suspense>
  );
}

const listItems = new Array(10).map((_, i) => i);

function SkeletonSessionList() {
  return (
    <List>
      {listItems.map((i) => (
        <ListItem key={i}>
          <ListItemText primary={<Skeleton />} />
        </ListItem>
      ))}
    </List>
  );
}

function SessionList() {
  const { userId } = Route.useParams();
  const sessions = useSuspenseQuery(usersQueryOptions.userSessions(userId));
  return (
    <List>
      {sessions.data.map((session) => (
        <ListItem key={session.id}>
          <ListItemText
            primary={DateTime.fromJSDate(session.expiresAt).toLocaleString(
              DateTime.DATETIME_MED,
            )}
          />
        </ListItem>
      ))}
    </List>
  );
}
