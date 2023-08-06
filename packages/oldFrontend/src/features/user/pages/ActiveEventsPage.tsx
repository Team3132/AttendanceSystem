import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import usePendingEvents from "../hooks/usePendingEvents";
import { Box, Stack } from "@chakra-ui/react";
import ActiveEvent from "../components/ActiveEvent";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const { userId } = params;

  if (userId) {
    return { userId };
  }

  return { userId: null };
};

export function Component() {
  const loaderData = useLoaderData() as ReturnType<typeof loader>;

  const pendingEventsQuery = usePendingEvents(loaderData.userId ?? undefined);

  if (pendingEventsQuery.data) {
    return (
      <Stack>
        {pendingEventsQuery.data.map((event) => {
          return <ActiveEvent rsvp={event} key={event.id} />;
        })}
      </Stack>
    );
  }

  if (pendingEventsQuery.isError) {
    return <div>Error</div>;
  }

  return <div>Loading...</div>;
}
