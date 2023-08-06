import { useMutation, useQueryClient } from "@tanstack/react-query";
import eventApi, { eventKeys } from "../../../api/query/event.api";
import { useAlert } from "react-alert";

export default function useCheckin() {
  const queryClient = useQueryClient();
  const alert = useAlert();
  return useMutation({
    ...eventApi.scanInToEvent,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.eventRsvps(variables.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: eventKeys.eventRsvp(variables.eventId),
      });
      alert.show("Checked in successfully!", { type: "success" });
    },
  });
}
