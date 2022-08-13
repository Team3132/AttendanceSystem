import useSWR from "swr";
import { AuthStatusDto, User } from "@generated";

export const useAuthStatus = () => {
  const { data, error } = useSWR<AuthStatusDto>(`/auth/status`);
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useMe = () => {
  const { isAuthenticated } = useAuthStatus();

  const { data: userData, error: userError } = useSWR<User>(
    isAuthenticated ? `/user/me` : null
  );
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
