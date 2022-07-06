import useSWR from "swr";
import { AuthStatusDto, User } from "../generated";

export const useUser = (userId: string = "me") => {
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

export const userAvatar = (userId: string = "me") => {
  const { data: authData, error: authError } =
    useSWR<AuthStatusDto>(`/api/auth/status`);

  const {
    data: userData,
    error: userError,
    mutate,
  } = useSWR<string>(
    authData?.isAuthenticated
      ? userId
        ? `/api/user/${userId}/avatar`
        : null
      : null
  );

  return {
    avatarId: userData,
    isLoading: (!userError || !authError) && (!userData || !authData),
    isError: userError,
    mutate,
  };
};
