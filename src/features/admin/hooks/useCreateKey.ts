import { adminMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import { createApiKey } from "@/server/services/adminService";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation } from "@tanstack/react-query";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createApiKeyFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(z.string())
  .handler(({ data, context: { user } }) => createApiKey(user.id, data));

type CreateApiKeyFn = FlattenServerFn<typeof createApiKeyFn>;

export default function useCreateKey() {
  return useMutation({
    mutationFn: useServerFn(createApiKeyFn) as CreateApiKeyFn,
    meta: {
      invalidates: [adminQueryKeys.apiKeys],
    },
  });
}
