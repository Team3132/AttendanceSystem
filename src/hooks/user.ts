import { api } from "@/client";
import { queryClient } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiError, AuthStatusDto, UpdateUserDto, User } from "../generated";
import { useAuthStatus } from "../hooks";

export const useUser = (userId: string = "me") => {
  const { isAuthenticated } = useAuthStatus();

  // const {
  //   data: userData,
  //   error: userError,
  //   mutate,
  // } = useSWR<User>(isAuthenticated && userId ? `/user/${userId}` : null);

  const { data: userData, error: userError } = useQuery({
    queryFn: () => api.user.userControllerUser(userId),
    queryKey: ["User", userId],
  });

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
  const { data: userData, error: userError } = useQuery({
    queryFn: () => api.user.userControllerUserAvatar(userId),
    enabled: !!isAuthenticated,
    queryKey: ["Avatar", userId],
  });

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
  const { data: usersData, error: usersError } = useQuery({
    queryFn: () => api.user.userControllerUsers(),
    enabled: !!isAdmin && !!isAuthenticated,
    queryKey: ["Users"],
  });
  return {
    users: usersData,
    isLoading: !usersError && !usersData,
    isError: usersError,
  };
};

export const useUpdateMe = () => {
  return useMutation<User, ApiError, UpdateUserDto>({
    mutationFn: (data) => api.user.userControllerUpdate(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["User", "me"], data);
    },
  });
};

export const useUpdateUser = () => {
  return useMutation<User, ApiError, { id: string; user: UpdateUserDto }>({
    mutationFn: (data) => api.user.userControllerUpdateUser(data.id, data.user),
    onSuccess: (data) => {
      queryClient.setQueryData(["User", data.id], data);
    },
  });
};
