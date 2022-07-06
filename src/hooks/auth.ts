import useSWR from "swr";
import { AuthStatusDto, User } from "../generated";

export const useAuthStatus = () => {
  const { data, error } = useSWR<AuthStatusDto>(`/api/auth/status`);
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useMe = () => {
  const { data: authData, error: authError } =
    useSWR<AuthStatusDto>(`/api/auth/status`);

  const { data: userData, error: userError } = useSWR<User>(
    authData?.isAuthenticated ? `/api/user/me` : null
  );
  return {
    user: userData,
    isLoading: (!userError || !authError) && (!userData || !authData),
    isError: userError,
  };
};
