import { trpcClient } from "@/trpcClient";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { OutreachTimeSchema } from "@/api/schema";
import { z } from "zod";
import { outreachQueryKeys } from "@/api/queryKeys";

type Options = Omit<z.infer<typeof OutreachTimeSchema>, "cursor">;

export const leaderboardQueryOptions = (options: Options) =>
  infiniteQueryOptions({
    queryKey: outreachQueryKeys.leaderboard(options),
    queryFn: ({ pageParam }) =>
      trpcClient.outreach.outreachLeaderboard.query({
        ...options,
        cursor: pageParam || undefined,
      }),
    initialPageParam: undefined as number | null | undefined,
    getNextPageParam: (page) => page.nextPage,
  });
