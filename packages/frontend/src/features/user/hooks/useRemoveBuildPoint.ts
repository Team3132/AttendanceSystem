import { trpc } from "@/trpcClient";

export const useRemoveBuildPoint = () => {
  const trpcUtils = trpc.useUtils();

  return trpc.users.removeBuildPoints.useMutation({
    onSuccess: (data) => {
      trpcUtils.users.getUserBuildPoints.invalidate({
        userId: data.userId,
      });
    },
  });
};
