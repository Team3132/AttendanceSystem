import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";

export default function useUser(userId: string = "me") {
  return useQuery({
    queryFn: () => api.user.getUser(userId),
    queryKey: userKeys.user(userId),
  });
}
