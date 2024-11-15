import { trpcClient } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { usersQueryKeys } from "@/api/queryKeys";

export default function useDeleteUserScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trpcClient.users.removeUserScancode.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userScancodes(data.userId),
      });
    },
  });
}
