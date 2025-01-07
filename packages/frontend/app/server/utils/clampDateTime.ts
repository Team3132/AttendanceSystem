import type { DateTime } from "luxon";

export default function clampDateTime(
	date: DateTime,
	min: DateTime,
	max: DateTime,
): DateTime {
	if (date < min) return min;
	if (date > max) return max;
	return date;
}
