import { api } from "@/client";
import { useQuery } from "@tanstack/react-query";
import useSWR from "swr";
import { Scancode } from "../generated";
import { useAuthStatus } from "../hooks";

export const useScancodes = () => {
  const { isAuthenticated } = useAuthStatus();

  // const {
  //   data: scancodeData,
  //   error: scancodeError,
  //   mutate,
  // } = useSWR<Scancode[]>(isAuthenticated ? `/scancode` : null);
  const {
    data: scancodeData,
    error: scancodeError,
  } = useQuery({queryFn: api.scancode.scancodeControllerFindAll});



  return {
    scancodes: scancodeData,
    isLoading: !scancodeError && !scancodeData,
    isError: scancodeError,
  };
};
