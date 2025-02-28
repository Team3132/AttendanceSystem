import { sessionMiddleware } from "@/middleware/authMiddleware";
import { outreachQueryKeys } from "@/server/queryKeys";
import { OutreachTimeSchema } from "@/server/schema";
import { getOutreachTime } from "@/server/services/outreach.service";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import type { z } from "zod";

type Options = Omit<z.infer<typeof OutreachTimeSchema>, "cursor">;

const getOutreachLeaderboardFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .validator(OutreachTimeSchema)
  .handler(async ({ data }) => getOutreachTime(data));

export const leaderboardQueryOptions = (options: Options) =>
  infiniteQueryOptions({
    queryKey: outreachQueryKeys.leaderboard(options),
    queryFn: ({ pageParam }) =>
      getOutreachLeaderboardFn({
        data: {
          ...options,
          cursor: pageParam || undefined,
        },
      }),
    initialPageParam: undefined as number | null | undefined,
    getNextPageParam: (page) => page.nextPage,
  });
