import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";

export default function useUsers() {
  return useQuery({
    queryFn: () => api.user.getUsers(),
    queryKey: userKeys.all,
  });
}
