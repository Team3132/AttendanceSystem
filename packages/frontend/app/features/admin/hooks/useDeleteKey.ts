import { mentorMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import { deleteApiKey } from "@/server/services/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";

const deleteApiKeyFn: ({
  data,
}: { data: string }) => ReturnType<typeof deleteApiKey> = createServerFn({
  method: "POST",
})
  .validator(z.string())
  .middleware([mentorMiddleware])
  .handler(({ data }) => deleteApiKey(data));

export default function useDeleteKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApiKeyFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.apiKeys,
      });
    },
  });
}
