import { DiscordRole, ApiError } from "@/generated";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { botKeys } from "./keys";

export default function useRoles() {
  return useQuery<DiscordRole[], ApiError>({
    queryFn: () => api.bot.getRoles(),
    queryKey: botKeys.all,
  });
}
