import { usersQueryKeys } from "@/queries/users.queries";
import { proxyClient } from "@/trpcClient";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export default function useDeleteSelfScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: proxyClient.users.removeSelfScancode.mutate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfScancodes(),
      });
    },
  });
}
