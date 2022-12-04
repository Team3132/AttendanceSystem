import { api } from "@/client";
import { ApiError, DiscordRole } from "@/generated";
import { useQuery } from "@tanstack/react-query";

export const useRoles = () => {
  return useQuery<DiscordRole[], ApiError>({
    queryFn: () => api.bot.getRoles(),
    queryKey: ["Roles"],
  });
};
