import { z } from "zod";
import { PagedSchema } from "./PagedSchema";

export const UserRecentRsvpSchema = z.object({
  userId: z.string(),
  eventId: z.string(),
  rsvpId: z.string(),
  eventTitle: z.string(),
  eventStart: z.string().datetime(),
  eventEnd: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PagedUserRecentRsvpsSchema = PagedSchema(UserRecentRsvpSchema);
