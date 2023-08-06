import { User, ApiError, UpdateUserDto } from "@/generated";
import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { userKeys } from "./keys";

export default function useUpdateUser() {
  return useMutation<User, ApiError, { id: string; user: UpdateUserDto }>({
    mutationFn: (data) => api.user.editUser(data.id, data.user),
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.user(data.id), data);
    },
  });
}
