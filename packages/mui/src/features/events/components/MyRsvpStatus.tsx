import { useQuery } from "@tanstack/react-query";
import eventApi from "../../../api/query/event.api";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Rsvp } from "../../../api/generated";
import useUpdateRsvp from "../hooks/useUpdateRsvp";

interface MyRsvpStatusProps {
  eventId: string;
}

export default function MyRsvpStatus(props: MyRsvpStatusProps) {
  const { eventId } = props;

  const myRsvpStatusQuery = useQuery(eventApi.getEventRsvp(eventId));
  const updateRsvpMutation = useUpdateRsvp();

  const handleChange = (event: SelectChangeEvent<Rsvp.status>) => {
    updateRsvpMutation.mutate({
      eventId,
      status: event.target.value as Rsvp.status,
      delay: 0,
    });
  };

  if (myRsvpStatusQuery.data) {
    return (
      <FormControl
        disabled={updateRsvpMutation.isPending}
        error={updateRsvpMutation.isError}
      >
        <InputLabel id="select-rsvp-status-label">Status</InputLabel>
        <Select
          labelId="select-rsvp-status-label"
          id="select-rsvp-status"
          //   value={age}
          value={myRsvpStatusQuery.data.status ?? ""}
          onChange={handleChange}
          label="Status"
          displayEmpty={false}
        >
          <MenuItem value={Rsvp["status"].YES}>Coming</MenuItem>
          <MenuItem value={Rsvp["status"].NO}>Not Coming</MenuItem>
          <MenuItem value={Rsvp["status"].MAYBE}>Maybe</MenuItem>
          <MenuItem value={Rsvp["status"].LATE}>Late</MenuItem>
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
        label={"Status"}
        disabled
        error
        helperText={myRsvpStatusQuery.error.message}
      />
    );
  }

  return <TextField label="Loading" disabled />;
}
