import { trpcClient } from "@/trpcClient";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { OutreachTimeSchema } from "backend/schema";
import { z } from "zod";

const queryKeys = {
  leaderboard: (options: Options) => ["leaderboard", options] as const,
};

type Options = Omit<z.infer<typeof OutreachTimeSchema>, "cursor">;

export const leaderboardQueryOptions = (options: Options) =>
  infiniteQueryOptions({
    queryKey: queryKeys.leaderboard(options),
    queryFn: ({ pageParam }) =>
      trpcClient.outreach.outreachLeaderboard.query({
        ...options,
        cursor: pageParam || undefined,
      }),
    initialPageParam: undefined as number | null | undefined,
    getNextPageParam: (page) => page.nextPage,
  });
