import { trpcClient } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { usersQueryKeys } from "@/api/queryKeys";

export default function useCreateSelfScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trpcClient.users.addSelfScancode.mutate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfScancodes(),
      });
    },
  });
}
