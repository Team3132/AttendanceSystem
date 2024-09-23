import { trpc } from "@/trpcClient";

export default function useDeleteUserScancode() {
  const utils = trpc.useUtils();

  return trpc.users.removeUserScancode.useMutation({
    onSuccess: () => {
      utils.users.getUserScancodes.invalidate();
    },
  });
}
