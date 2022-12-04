import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";

export default function useOutreachReport(userId: string = "me") {
  return useQuery({
    queryFn: () => api.user.getUserOutreachReport(userId),
    queryKey: userKeys.outreachReport(userId),
  });
}
