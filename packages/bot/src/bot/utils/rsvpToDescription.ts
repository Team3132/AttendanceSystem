import type { RSVPUserSchema } from "backend/schema";
import type { z } from "zod";

export default function rsvpToDescription(
  rsvp: z.infer<typeof RSVPUserSchema>,
  first = false,
) {
  return `${rsvp.user.username ?? ""} - ${
    rsvp.status === "LATE" && rsvp.delay !== null
      ? `:clock3: ${rsvp.delay} minutes late`
      : rsvp.status === "LATE"
        ? ":clock3:"
        : rsvp.status === "YES"
          ? ":white_check_mark:"
          : rsvp.status === "MAYBE"
            ? ":grey_question:"
            : ":x:"
  }${first ? " :star:" : ""}`;
}
