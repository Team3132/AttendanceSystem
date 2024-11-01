<<<<<<< HEAD
import { trpcClient } from "@/trpcClient";
=======
import { proxyClient } from "@/trpcClient";
>>>>>>> 5fa3d80667af05e512045626e9733865eeaf59b8
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
<<<<<<< HEAD
      trpcClient.outreach.outreachLeaderboard.query({
=======
      proxyClient.outreach.outreachLeaderboard.query({
>>>>>>> 5fa3d80667af05e512045626e9733865eeaf59b8
        ...options,
        cursor: pageParam || undefined,
      }),
    initialPageParam: undefined as number | null | undefined,
    getNextPageParam: (page) => page.nextPage,
  });
