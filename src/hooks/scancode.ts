import useSWR from "swr";
import { AuthStatusDto, Scancode } from "../generated";
import { useAuthStatus } from "./auth";

export const useScancodes = () => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: scancodeData,
    error: scancodeError,
    mutate,
  } = useSWR<Scancode[]>(isAuthenticated ? `/api/scancode` : null);
  return {
    scancodes: scancodeData,
    isLoading: !scancodeError && !scancodeData,
    isError: scancodeError,
    mutate,
  };
};
