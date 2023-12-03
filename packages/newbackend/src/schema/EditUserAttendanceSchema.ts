import { z } from "zod";

export const EditUserAttendanceSchema = z.object({
    userId: z.string(),
    eventId: z.string(),
    checkinTime: z.string().datetime().optional(),
    checkoutTime: z.string().datetime().optional(),
})