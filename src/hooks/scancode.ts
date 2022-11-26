import { api } from "@/client";
import { queryClient } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiError, CreateScancodeDto, Scancode } from "../generated";
import { useAuthStatus } from "../hooks";

export const useScancodes = () => {
  const { isAuthenticated } = useAuthStatus();

  // const {
  //   data: scancodeData,
  //   error: scancodeError,
  //   mutate,
  // } = useSWR<Scancode[]>(isAuthenticated ? `/scancode` : null);
  const { data: scancodeData, error: scancodeError } = useQuery({
    queryFn: () => api.scancode.scancodeControllerFindAll(),
    queryKey: ["Scancodes"],
  });

  return {
    scancodes: scancodeData,
    isLoading: !scancodeError && !scancodeData,
    isError: scancodeError,
  };
};

export const useCreateScancode = () => {
  return useMutation<Scancode, ApiError, CreateScancodeDto>({
    mutationFn: (dto) => api.scancode.scancodeControllerCreate(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(["Scancodes"]);
    },
  });
};

export const useDeleteScancode = () => {
  return useMutation<Scancode, ApiError, string>({
    mutationFn: (id) => api.scancode.scancodeControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["Scancodes"]);
    },
  });
};
