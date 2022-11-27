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
    queryFn: () => api.user.getUser(userId),
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
    queryFn: () => api.user.getUserAvatar(userId),
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
    queryFn: () => api.user.getUsers(),
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
    mutationFn: (data) => api.user.editMe(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["User", "me"], data);
    },
  });
};

export const useUpdateUser = () => {
  return useMutation<User, ApiError, { id: string; user: UpdateUserDto }>({
    mutationFn: (data) => api.user.editUser(data.id, data.user),
    onSuccess: (data) => {
      queryClient.setQueryData(["User", data.id], data);
    },
  });
};

export const useOutreachReport = (
  userId: string = "me",
  from?: string,
  to?: string
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => api.user.getUserOutreachReport(userId, from, to),
    queryKey: ["OutreachReport", userId],
  });
  return { report: data, ...rest };
};
