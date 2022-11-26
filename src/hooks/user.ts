import { api } from "@/client";
import { useQuery } from "@tanstack/react-query";
import useSWR from "swr";
import { AuthStatusDto, User } from "../generated";
import { useAuthStatus } from "../hooks";

export const useUser = (userId: string = "me") => {
  const { isAuthenticated } = useAuthStatus();

  
  // const {
  //   data: userData,
  //   error: userError,
  //   mutate,
  // } = useSWR<User>(isAuthenticated && userId ? `/user/${userId}` : null);

  const {
    data: userData,
    error: userError,
  } = useQuery({queryFn: () => api.user.userControllerUser(userId)})

  return {
    user: userData,
    isLoading: !userError && !userData,
    isError: userError,
  };
};

export const userAvatar = (userId: string = "me") => {
  const { isAuthenticated } = useAuthStatus();

  // const {
  //   data: userData,
  //   error: userError,
  //   mutate,
  // } = useSWR<string>(
  //   isAuthenticated && userId ? `/user/${userId}/avatar` : null
  // );
  const {
    data: userData,
    error: userError,
  } = useQuery({queryFn: () => api.user.userControllerUserAvatar(userId), enabled: !!isAuthenticated})

  return {
    avatarId: userData,
    isLoading: !userError && !userData,
    isError: userError,
  };
};

export const useUsers = () => {
  const { isAuthenticated, isAdmin } = useAuthStatus();
  // const {
  //   data: usersData,
  //   error: usersError,
  //   mutate,
  // } = useSWR<User[]>(isAuthenticated && isAdmin ? `/user` : null);
  const {
    data: usersData,
    error: usersError,
  } = useQuery({queryFn: api.user.userControllerUsers, enabled: !!isAdmin && !!isAuthenticated})
  return {
    users: usersData,
    isLoading: !usersError && !usersData,
    isError: usersError,
  };
};
