import { mentorMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import { createApiKey } from "@/server/services/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";

const createApiKeyFn: ({
  data,
}: { data: string }) => ReturnType<typeof createApiKey> = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(z.string())
  .handler(({ data, context: { user } }) => createApiKey(user.id, data));

export default function useCreateKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApiKeyFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.apiKeys,
      });
    },
  });
}
