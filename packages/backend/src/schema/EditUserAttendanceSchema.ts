import { z } from "zod";

export const EditUserAttendanceSchema = z.object({
  userId: z.string(),
  eventId: z.string(),
  checkinTime: z.string().datetime({ offset: true }).optional(),
  checkoutTime: z.string().datetime({ offset: true }).optional(),
});
