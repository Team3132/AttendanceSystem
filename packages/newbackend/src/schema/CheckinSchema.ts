import { z } from "zod";

export const CheckinSchema = z.object({
    eventId: z.string(),
    secret: z.string(),
})