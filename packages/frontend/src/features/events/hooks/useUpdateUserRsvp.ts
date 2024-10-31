import { eventQueryKeys } from "@/queries/events.queries";
import { proxyClient, trpc } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateUserRsvp() {
  const utils = trpc.useUtils();
  const queryClient = useQueryClient();

  // return useMutation({
  //   ...eventApi.updateUserEventRsvp,
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries({
  //       queryKey: eventKeys.eventRsvps(data.eventId),
  //     });
  //   },
  // });
  // return trpc.events.editUserAttendance.useMutation({
  //   onSuccess: (data) => {
  //     utils.events.getEventRsvps.invalidate(data.eventId);
  //   },
  // });
  return useMutation({
    mutationFn: proxyClient.events.editUserAttendance.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
