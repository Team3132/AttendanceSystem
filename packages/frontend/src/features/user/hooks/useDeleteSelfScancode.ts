import { trpc } from "@/utils/trpc";

export default function useDeleteSelfScancode() {
  const utils = trpc.useUtils();

  return trpc.users.removeSelfScancode.useMutation({
    onSuccess: () => {
      utils.users.getSelfScancodes.invalidate();
    },
  });
}
