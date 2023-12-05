import { trpc } from "../../../utils/trpc";

export default function useCreateSelfScancode() {
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

  return trpc.users.addSelfScancode.useMutation({
    onSuccess: () => {
      utils.users.getSelfScancodes.invalidate();
    },
  });
}
