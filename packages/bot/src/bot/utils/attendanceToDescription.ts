import { bold } from "discord.js";

export default function attendanceToDescription(rsvp: {
  attended: boolean;
  userId: string;
  user: { username?: string };
}) {
  return `${rsvp.user.username ?? ""} - ${bold(
    rsvp.attended ? "Attended" : "Not Attended",
  )}`;
}
