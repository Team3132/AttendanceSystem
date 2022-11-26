import { api } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { ApiClient, AuthService, AuthStatusDto, User } from "../generated";

export const useAuthStatus = () => {
  const { data, error } = useQuery({
    queryFn: () => api.auth.authControllerStatus(),
    queryKey: ["AuthStatus"],
  });
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useMe = () => {
  const { isAuthenticated } = useAuthStatus();

  const { data: userData, error: userError } = useQuery({
    queryFn: () => api.user.userControllerMe(),
    enabled: !!isAuthenticated,
    queryKey: ["Me"],
  });
  return {
    user: userData,
    isLoading: !userError && !userData,
    isError: userError,
  };
};

export const useIsAdmin = () => {
  const { isAdmin, isError, isLoading } = useAuthStatus();
  return {
    isAdmin,
    isError,
    isLoading,
  };
};
