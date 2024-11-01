import { usersQueryKeys } from "@/queries/users.queries";
<<<<<<< HEAD
import { trpcClient } from "@/trpcClient";
=======
import { proxyClient } from "@/trpcClient";
>>>>>>> 5fa3d80667af05e512045626e9733865eeaf59b8
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export default function useDeleteSelfScancode() {
  const queryClient = useQueryClient();

  return useMutation({
<<<<<<< HEAD
    mutationFn: trpcClient.users.removeSelfScancode.mutate,
=======
    mutationFn: proxyClient.users.removeSelfScancode.mutate,
>>>>>>> 5fa3d80667af05e512045626e9733865eeaf59b8
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfScancodes(),
      });
    },
  });
}
