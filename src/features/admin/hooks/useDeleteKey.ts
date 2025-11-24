import { adminMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import { deleteApiKey } from "@/server/services/adminService";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const deleteApiKeyFn = createServerFn({
  method: "POST",
})
  .inputValidator(z.string())
  .middleware([adminMiddleware])
  .handler(({ data }) => deleteApiKey(data));

type DeleteApiKeyFn = FlattenServerFn<typeof deleteApiKeyFn>;

export default function useDeleteKey() {
  return useMutation({
    mutationFn: deleteApiKeyFn as DeleteApiKeyFn,
    meta: {
      invalidates: [adminQueryKeys.apiKeys],
    },
  });
}
