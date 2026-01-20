import { sessionMiddleware } from "@/middleware/authMiddleware";
import { usersQueryKeys } from "@/server/queryKeys";
import { createUserScancode } from "@/server/services/user.service";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createSelfScancodeFn = createServerFn({
  method: "POST",
})
  .middleware([sessionMiddleware])
  .inputValidator(z.string())
  .handler(async ({ data, context }) =>
    createUserScancode(context, context.user.id, data),
  );

type CreateSelfScancodeFn = FlattenServerFn<typeof createSelfScancodeFn>;

export default function useCreateSelfScancode() {
  return useMutation({
    mutationFn: createSelfScancodeFn as CreateSelfScancodeFn,
    meta: {
      invalidates: [usersQueryKeys.userSelfScancodes()],
    },
  });
}
