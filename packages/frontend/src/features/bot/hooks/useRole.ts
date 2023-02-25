import { DiscordRole } from "@/generated";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { botKeys } from "./keys";

export default function useRole(roleId: string) {
  return useQuery<DiscordRole[], unknown, DiscordRole | undefined>({
    queryFn: () => api.bot.getRoles(),
    select: (data) => data.find((role) => role.id === roleId),
    // select: (data) => data,
    queryKey: botKeys.all,
  });
}
