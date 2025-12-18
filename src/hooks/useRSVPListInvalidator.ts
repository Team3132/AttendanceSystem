import { sessionMiddleware } from "@/middleware/authMiddleware";
import { usersQueryOptions } from "@/queries/users.queries";
import { eventQueryKeys } from "@/server/queryKeys";
import { pipe } from "@graphql-yoga/subscription";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
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
  .handler(async function* ({ data: { eventId }, context: { pubSub } }) {
    const iterator = pipe(
      pubSub.subscribe("event:rsvpUpdated", eventId),
      //   filter((update) => update.userId !== user.id),
    );

    for await (const payload of iterator) {
      yield payload;
    }
  });

export default function useRSVPListInvalidator(eventId: string) {
  const queryClient = useQueryClient();

  const authInfo = useQuery(usersQueryOptions.userSelfDetails());

  useQuery({
    queryKey: ["eventInvalidator", eventId, authInfo.data?.id ?? "no-auth"],
    retry() {
      return true;
    },
    queryFn: async ({ signal }) => {
      for await (const msg of await eventRsvpInvalidatorListenerFn({
        data: { eventId },
        signal: signal,
      })) {
        queryClient.invalidateQueries({
          queryKey: eventQueryKeys.eventRsvps(eventId),
        });
        if (authInfo.data?.id !== msg.userId) {
          queryClient.invalidateQueries({
            queryKey: eventQueryKeys.eventRsvp(eventId),
          });
        }
      }
    },
  });
}
