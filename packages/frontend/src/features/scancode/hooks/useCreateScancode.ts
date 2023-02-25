import { Scancode, ApiError, CreateScancodeDto } from "@/generated";
import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { scancodeKeys } from "./keys";

export default function useCreateScancode(userId: string = "me") {
  return useMutation<Scancode, ApiError, CreateScancodeDto>({
    mutationFn: (dto) => api.user.createUserScancode(userId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries(scancodeKeys.user(userId));
    },
  });
}
