import useSWR from "swr";
import { Scancode } from "@generated";
import { useAuthStatus } from "@hooks";

export const useScancodes = () => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: scancodeData,
    error: scancodeError,
    mutate,
  } = useSWR<Scancode[]>(isAuthenticated ? `/scancode` : null);
  return {
    scancodes: scancodeData,
    isLoading: !scancodeError && !scancodeData,
    isError: scancodeError,
    mutate,
  };
};
