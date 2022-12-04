import { Scancode, ApiError, CreateScancodeDto } from "@/generated";
import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { scancodeKeys } from "./keys";

export default function useCreateScancode() {
  return useMutation<Scancode, ApiError, CreateScancodeDto>({
    mutationFn: (dto) => api.user.createMeScancode(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(scancodeKeys.all);
    },
  });
}
