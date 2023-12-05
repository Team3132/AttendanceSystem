import { trpc } from "../../../utils/trpc";

export default function useUpdateUserRsvp() {
  const utils = trpc.useUtils();

  // return useMutation({
  //   ...eventApi.updateUserEventRsvp,
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries({
  //       queryKey: eventKeys.eventRsvps(data.eventId),
  //     });
  //   },
  // });
  return trpc.events.editUserAttendance.useMutation({
    onSuccess: (data) => {
      utils.events.getEventRsvps.invalidate(data.eventId);
    },
  });
}
