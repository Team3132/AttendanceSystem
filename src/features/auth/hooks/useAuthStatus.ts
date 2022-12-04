import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { authKeys } from "./keys";

export default function useAuthStatus() {
  const { data, ...rest } = useQuery({
    queryFn: () => api.auth.authStatus(),
    queryKey: authKeys.status,
  });
  return {
    ...data,
    ...rest,
  };
}
