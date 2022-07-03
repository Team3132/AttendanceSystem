import useSWR from "swr";
import { components } from "../generated/types";

export const useAuthStatus = () => {
  const { data, error } =
    useSWR<components["schemas"]["AuthStatusDto"]>(`/api/auth/status`);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useMe = () => {
  const { data: authData, error: authError } =
    useSWR<components["schemas"]["AuthStatusDto"]>(`/api/auth/status`);

  const { data: userData, error: userError } = useSWR<
    components["schemas"]["User"]
  >(authData?.isAuthenticated ? `/api/user/me` : null);
  return {
    user: userData,
    isLoading: (!userError || !authError) && (!userData || !authData),
    isError: userError,
  };
};
