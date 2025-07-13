import { adminMiddleware } from "@/middleware/authMiddleware";
import { deployCommands } from "@/server/services/discordService";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const deployCommandsFn = createServerFn({
  type: "dynamic",
  method: "POST",
  response: "data",
})
  .middleware([adminMiddleware])
  .handler(async () => deployCommands());

export default function useDeployCommands() {
  return useMutation({
    mutationFn: deployCommandsFn,
  });
}
