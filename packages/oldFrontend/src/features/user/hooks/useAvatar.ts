import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";

export default function useAvatar(userId: string = "me") {
  return useQuery({
    queryFn: () => api.user.getUserAvatar(userId),
    queryKey: userKeys.avatar(userId),
  });
}
