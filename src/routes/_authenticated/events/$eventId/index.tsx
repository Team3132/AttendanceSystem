import RsvpList from "@/features/events/components/RSVPList";
import { eventQueryOptions } from "@/queries/events.queries";
import {} from "@tanstack/react-router";

export const Route = createFileRoute({
  loader: ({ context: { queryClient }, params: { eventId } }) => {
    queryClient.prefetchQuery(eventQueryOptions.eventRsvps(eventId));
    queryClient.prefetchQuery(eventQueryOptions.eventRsvp(eventId));
  },
  head: () => ({
    meta: [
      {
        title: "Event - RSVPs",
      },
    ],
  }),
  component: Component,
});

function Component() {
  return <RsvpList />;
}
