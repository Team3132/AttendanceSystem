import { sessionMiddleware } from "@/middleware/authMiddleware";
import { usersQueryOptions } from "@/queries/users.queries";
import { pubSub } from "@/server/pubSub";
import { eventQueryKeys } from "@/server/queryKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import z from "zod";

const eventRsvpInvalidatorListenerFn = createServerFn({
  method: "GET",
})
  .middleware([sessionMiddleware])
  .inputValidator(
    z.object({
      eventId: z.string(),
    }),
  )
  .handler(async function* ({ data: { eventId } }) {
    const iterator = pubSub.subscribe("event:rsvpUpdated", eventId);

    for await (const payload of iterator) {
      yield payload;
    }
  });

export default function useRSVPListInvalidator(eventId: string) {
  const queryClient = useQueryClient();

  const authInfo = useQuery(usersQueryOptions.userSelfDetails());

  useEffect(() => {
    console.log("Setting up RSVP list invalidator for event:", eventId);
    const abortController = new AbortController();

    (async () => {
      for await (const msg of await eventRsvpInvalidatorListenerFn({
        data: { eventId },
        signal: abortController.signal,
      })) {
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.eventRsvps(eventId),
        });
        if (authInfo.data?.id === msg.userId) {
          queryClient.invalidateQueries({
            queryKey: eventQueryKeys.eventRsvp(eventId),
          });
        }
      }
    })();

    return () => {
      abortController.abort();
      console.log("Torn down RSVP list invalidator for event:", eventId);
    };
  }, [eventId, queryClient, authInfo.data?.id]);
}
