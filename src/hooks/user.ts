import useSWR from "swr";
import { AuthStatusDto, User } from "@generated";
import { useAuthStatus } from "@hooks";

export const useUser = (userId: string = "me") => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: userData,
    error: userError,
    mutate,
  } = useSWR<User>(
    isAuthenticated ? (userId ? `/api/user/${userId}` : null) : null
  );

  return {
    user: userData,
    isLoading: !userError && !userData,
    isError: userError,
    mutate,
  };
};

export const userAvatar = (userId: string = "me") => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: userData,
    error: userError,
    mutate,
  } = useSWR<string>(
    isAuthenticated ? (userId ? `/api/user/${userId}/avatar` : null) : null
  );

  return {
    avatarId: userData,
    isLoading: !userError && !userData,
    isError: userError,
    mutate,
  };
};
