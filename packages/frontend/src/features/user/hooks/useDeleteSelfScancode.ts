import { trpcClient } from "@/trpcClient";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { usersQueryKeys } from "backend/querykeys";

export default function useDeleteSelfScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trpcClient.users.removeSelfScancode.mutate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfScancodes(),
      });
    },
  });
}
