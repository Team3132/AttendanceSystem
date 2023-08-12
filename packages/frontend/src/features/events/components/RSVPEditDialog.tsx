import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Stack,
  Button,
  DialogActions,
} from "@mui/material";
import useZodForm from "../../../hooks/useZodForm";
import { z } from "zod";
import { Rsvp, UpdateRsvpDto } from "../../../api/generated";
import useUpdateUserRsvp from "../hooks/useUpdateUserRsvp";
import { LoadingButton } from "@mui/lab";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import { DateTime } from "luxon";

interface RSVPEditDialogProps {
  onOpen: () => void;
  onClose: () => void;
  open: boolean;
  rsvp: Rsvp;
}

const UpdateRsvpSchema = z.object({
  status: z.nativeEnum(UpdateRsvpDto.status).optional(),
  checkinTime: z.string().datetime().optional(),
  checkoutTime: z.string().datetime().optional(),
});

export default function RSVPEditDialog(props: RSVPEditDialogProps) {
  const { onClose, open, rsvp } = props;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useZodForm({
    schema: UpdateRsvpSchema,
    defaultValues: {
      status: rsvp.status ?? undefined,
      checkinTime: rsvp.checkinTime ?? undefined,
      checkoutTime: rsvp.checkoutTime ?? undefined,
    },
  });

  const updateUserRsvpMutation = useUpdateUserRsvp();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateUserRsvpMutation.mutateAsync({
        eventId: rsvp.eventId,
        rsvpId: rsvp.id,
        ...data,
      });
    } catch (error) {}
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      component={"form"}
      onSubmit={onSubmit}
    >
      <DialogTitle>Register new code</DialogTitle>
      <DialogContent>
        <DialogContentText>Edit an RSVP.</DialogContentText>
        <Stack
          gap={2}
          sx={{
            mt: 2,
          }}
        >
          <Controller
            control={control}
            name="checkinTime"
            render={({ field: { value, onChange, ...rest } }) => (
              <DateTimePicker
                value={value ? DateTime.fromISO(value) : DateTime.local()}
                label="Checkin Time"
                onChange={(date) => {
                  if (date) {
                    onChange(date.toISO());
                  }
                }}
                {...rest}
              />
            )}
          />
          <Controller
            control={control}
            name="checkoutTime"
            render={({ field: { value, onChange, ...rest } }) => (
              <DateTimePicker
                value={value ? DateTime.fromISO(value) : DateTime.local()}
                label="Checkout Time"
                onChange={(date) => {
                  if (date) {
                    onChange(date.toISO());
                  }
                }}
                {...rest}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton type="submit" disabled={isSubmitting}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
