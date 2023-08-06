import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { scancodeKeys } from "./keys";

export default function useScancodes(userId: string = "me") {
  return useQuery({
    queryFn: () => api.user.getUserScancodes(userId),
    queryKey: scancodeKeys.user(userId),
  });
}
