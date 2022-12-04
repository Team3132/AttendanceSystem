import { DateTime } from "luxon";

export const eventKeys = {
  all: ["events"] as const,
  range: (take?: number, from?: DateTime, to?: DateTime) => [
    ...eventKeys.all,
    from?.toISO(),
    to?.toISO(),
    take,
  ],
  details: () => [...eventKeys.all, "details"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  tokens: () => [...eventKeys.all, "tokens"] as const,
  token: (id: string) => [...eventKeys.tokens(), id] as const,
};
