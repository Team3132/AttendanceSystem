import { api } from "@/client";
import { ApiError, DiscordRole } from "@/generated";
import { useQuery } from "@tanstack/react-query";

export const useRoles = () => {
  return useQuery<DiscordRole[], ApiError>({
    queryFn: () => api.bot.getRoles(),
    queryKey: ["Roles"],
  });
};

export const useRole = (roleId: string) => {
  return useQuery<DiscordRole[], unknown, DiscordRole | undefined, string[]>({
    queryFn: () => api.bot.getRoles(),
    select: (data) => data.find((role) => role.id === roleId),
    // select: (data) => data,
    queryKey: ["Roles"],
  });
};
