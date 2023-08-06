import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import eventApi, { eventKeys } from "../../../api/query/event.api";

export default function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    ...eventApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.events(),
      });
    },
  });
}
