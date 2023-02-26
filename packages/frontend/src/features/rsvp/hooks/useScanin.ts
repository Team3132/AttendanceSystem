import { Rsvp, ApiError, ScaninDto } from "@/generated";
import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { rsvpKeys } from "./keys";

export default function useScanin() {
  return useMutation<Rsvp, ApiError, { eventId: string; scan: ScaninDto }>(
    ({ eventId, scan }) => api.event.scaninEvent(eventId, scan),
    {
      onSuccess: (data, { eventId }) => {
        queryClient.invalidateQueries(rsvpKeys.event(eventId));
      },
    }
  );
}
