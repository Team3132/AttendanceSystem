import { DateTime } from "luxon";

// parse rfc 3339 date string to luxon DateTime
export function parseDate(date: string | null) {
  if (!date) {
    return null;
  }
  return DateTime.fromMillis(Date.parse(date)).toISO();
}
