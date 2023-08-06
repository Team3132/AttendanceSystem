import { useMutation, useQueryClient } from "@tanstack/react-query";
import userApi, { userKeys } from "../../../api/query/user.api";

export default function useCreateScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    ...userApi.createUserScancode,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.userScancodes(variables.userId),
      });
    },
  });
}
