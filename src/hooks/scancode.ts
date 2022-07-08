import useSWR from "swr";
import { AuthStatusDto, Scancode } from "../generated";

export const useScancodes = () => {
  const { data: authData, error: authError } =
    useSWR<AuthStatusDto>(`/api/auth/status`);

  const {
    data: scancodeData,
    error: scancodeError,
    mutate,
  } = useSWR<Scancode[]>(authData?.isAuthenticated ? `/api/scancode` : null);
  return {
    scancodes: scancodeData,
    isLoading: (!scancodeError || !authError) && (!scancodeData || !authData),
    isError: scancodeError,
    mutate,
  };
};
