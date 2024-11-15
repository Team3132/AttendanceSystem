import type { RSVPUserSchema } from "frontend/types";
import type { z } from "zod";

export const statusToEmoji = (
  status: z.infer<typeof RSVPUserSchema>["status"],
) => {
  switch (status) {
    case "YES":
      return ":white_check_mark:";
    case "NO":
      return ":x:";
    case "MAYBE":
      return ":grey_question:";
    case "LATE":
      return ":clock3:";
    case "ATTENDED":
      return ":star:";
    default:
      return "";
  }
};

export default function rsvpToDescription(
  username: string,
  status: z.infer<typeof RSVPUserSchema>["status"],
) {
  return `${username} - ${statusToEmoji(status)}`;
}
