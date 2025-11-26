import { createPubSub } from "@graphql-yoga/subscription";
import type z from "zod";
import type { RSVPStatusSchema } from "./schema";

export const pubSub = createPubSub<{
  "event:rsvpUpdated": [
    eventId: string,
    payload: {
      userId: string;
      rsvpId: string;
      status?: z.infer<typeof RSVPStatusSchema> | null;
    },
  ];
}>();
