import useSWR from "swr";
import { AuthStatusDto, User } from "../generated";

export const useUser = (userId?: string) => {
  const { data: authData, error: authError } =
    useSWR<AuthStatusDto>(`/api/auth/status`);

  const {
    data: userData,
    error: userError,
    mutate,
  } = useSWR<User>(
    authData?.isAuthenticated ? (userId ? `/api/user/${userId}` : null) : null
  );

  return {
    user: userData,
    isLoading: (!userError || !authError) && (!userData || !authData),
    isError: userError,
    mutate,
  };
};
