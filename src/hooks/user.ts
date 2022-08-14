import useSWR from "swr";
import { AuthStatusDto, User } from "../generated";
import { useAuthStatus } from "../hooks";

export const useUser = (userId: string = "me") => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: userData,
    error: userError,
    mutate,
  } = useSWR<User>(isAuthenticated && userId ? `/user/${userId}` : null);

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
    isAuthenticated && userId ? `/user/${userId}/avatar` : null
  );

  return {
    avatarId: userData,
    isLoading: !userError && !userData,
    isError: userError,
    mutate,
  };
};

export const useUsers = () => {
  const { isAuthenticated, isAdmin } = useAuthStatus();
  const {
    data: usersData,
    error: usersError,
    mutate,
  } = useSWR<User[]>(isAuthenticated && isAdmin ? `/user` : null);
  return {
    users: usersData,
    isLoading: !usersError && !usersData,
    isError: usersError,
    mutate,
  };
};
