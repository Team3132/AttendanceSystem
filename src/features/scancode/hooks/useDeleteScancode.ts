import { Scancode, ApiError } from "@/generated";
import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { scancodeKeys } from "./keys";

export default function useDeleteScancode() {
  return useMutation<Scancode, ApiError, string>({
    mutationFn: (id) => api.scancode.deleteScancode(id),
    onSuccess: () => {
      queryClient.invalidateQueries(scancodeKeys.all);
    },
  });
}
