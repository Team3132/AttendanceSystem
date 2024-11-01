import { usersQueryKeys } from "@/queries/users.queries";
import { proxyClient } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function useCreateSelfScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: proxyClient.users.addSelfScancode.mutate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfScancodes(),
      });
    },
  });
}
