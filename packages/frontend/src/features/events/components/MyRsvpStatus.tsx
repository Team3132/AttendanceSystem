import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import useUpdateRsvp from "../hooks/useUpdateRsvp";
import { trpc } from "../../../utils/trpc";
import { z } from "zod";
import { RSVPSchema } from "newbackend/schema";

interface MyRsvpStatusProps {
  eventId: string;
}

type RSVPStatus = NonNullable<z.infer<typeof RSVPSchema>["status"]>;

export default function MyRsvpStatus(props: MyRsvpStatusProps) {
  const { eventId } = props;

  const myRsvpStatusQuery = trpc.events.getSelfEventRsvp.useQuery(eventId);
  const updateRsvpMutation = useUpdateRsvp();

  const handleChange = (event: SelectChangeEvent<RSVPStatus>) => {
    updateRsvpMutation.mutate({
      eventId,
      status: event.target.value as RSVPStatus,
      delay: 0,
    });
  };

  if (myRsvpStatusQuery.data) {
    return (
      <FormControl
        disabled={updateRsvpMutation.isLoading}
        error={updateRsvpMutation.isError}
      >
        <InputLabel id="select-rsvp-status-label">My Status</InputLabel>
        <Select
          labelId="select-rsvp-status-label"
          id="select-rsvp-status"
          //   value={age}
          value={myRsvpStatusQuery.data.status ?? ""}
          onChange={handleChange}
          label="My Status"
          displayEmpty={false}
        >
          <MenuItem value={"YES"}>Coming</MenuItem>
          <MenuItem value={"NO"}>Not Coming</MenuItem>
          <MenuItem value={"MAYBE"}>Maybe</MenuItem>
          <MenuItem value={"LATE"}>Late</MenuItem>
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
