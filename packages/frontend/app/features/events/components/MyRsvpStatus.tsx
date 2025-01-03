import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
} from "@mui/material";
import type { RSVPSchema, RSVPStatusUpdateSchema } from "@/api/schema";
import type { z } from "zod";
import useUpdateRsvp from "../hooks/useUpdateRsvp";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { eventQueryOptions } from "@/queries/events.queries";

interface MyRsvpStatusProps {
  eventId: string;
}

type RSVPStatus = NonNullable<z.infer<typeof RSVPSchema>["status"]>;

export default function MyRsvpStatus(props: MyRsvpStatusProps) {
  const { eventId } = props;

  const myRsvpStatusQuery = useSuspenseQuery(
    eventQueryOptions.eventRsvp(eventId),
  );
  const updateRsvpMutation = useUpdateRsvp();

  const handleChange = (event: SelectChangeEvent<RSVPStatus>) => {
    updateRsvpMutation.mutate({
      data: {
        eventId,
        status: event.target.value as z.infer<typeof RSVPStatusUpdateSchema>,
        delay: 0,
      },
    });
  };

  if (myRsvpStatusQuery.data !== undefined) {
    return (
      <FormControl
        disabled={updateRsvpMutation.isPending}
        error={updateRsvpMutation.isError}
      >
        <InputLabel id="select-rsvp-status-label">My Status</InputLabel>
        <Select
          labelId="select-rsvp-status-label"
          id="select-rsvp-status"
          //   value={age}
          value={myRsvpStatusQuery.data?.status ?? ""}
          onChange={handleChange}
          label="My Status"
          displayEmpty={true}
        >
          <MenuItem value={"YES"}>Coming</MenuItem>
          <MenuItem value={"NO"}>Not Coming</MenuItem>
          <MenuItem value={"MAYBE"}>Maybe</MenuItem>
          <MenuItem value={"LATE"}>Late</MenuItem>
          <MenuItem value={"ATTENDED"} disabled>
            Attended
          </MenuItem>
        </Select>
        {updateRsvpMutation.isError ? (
          <FormHelperText error>
            {updateRsvpMutation.error.message}
          </FormHelperText>
        ) : null}
      </FormControl>
    );
  }

  if (myRsvpStatusQuery.isError) {
    return (
      <TextField
        label={"My Status"}
        disabled
        error
        helperText={myRsvpStatusQuery.error.message}
      />
    );
  }

  return <TextField label="Loading" disabled />;
}
