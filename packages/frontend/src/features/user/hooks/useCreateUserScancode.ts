import { trpc } from "@/trpcClient";

export default function useCreateUserScancode() {
  // const queryClient = useQueryClient();

  // return useMutation({
  //   ...userApi.createUserScancode,
  //   onSuccess: (_data, variables) => {
  //     queryClient.invalidateQueries({
  //       queryKey: userKeys.userScancodes(variables.userId),
  //     });
  //   },
  // });

  const utils = trpc.useUtils();

  return trpc.users.addUserScanCode.useMutation({
    onSuccess: (data) => {
      utils.users.getUserScancodes.invalidate(data.userId);
    },
  });
}
