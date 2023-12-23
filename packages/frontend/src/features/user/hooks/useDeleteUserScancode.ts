import { trpc } from "@/utils/trpc";

export default function useDeleteUserScancode() {
  const utils = trpc.useUtils();

  return trpc.users.removeUserScancode.useMutation({
    onSuccess: () => {
      utils.users.getUserScancodes.invalidate();
    },
  });
}
