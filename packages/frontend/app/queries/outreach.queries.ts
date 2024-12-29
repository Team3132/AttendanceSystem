import { infiniteQueryOptions } from "@tanstack/react-query";
import { OutreachTimeSchema } from "@/api/schema";
import { z } from "zod";
import { outreachQueryKeys } from "@/api/queryKeys";
import { sessionMiddleware } from "@/middleware/authMiddleware";
import { getOutreachTime } from "@/api/services/outreach.service";
import { createServerFn } from "@tanstack/start";

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
