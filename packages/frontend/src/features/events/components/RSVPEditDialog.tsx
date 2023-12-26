import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Stack,
  Button,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import useZodForm from "../../../hooks/useZodForm";
import { z } from "zod";
import useUpdateUserRsvp from "../hooks/useUpdateUserRsvp";
import { LoadingButton } from "@mui/lab";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import { DateTime } from "luxon";
import { FaRecycle } from "react-icons/fa6";
import {
  RSVPSchema,
  RSVPStatusSchema,
} from "@team3132/attendance-backend/schema";

interface RSVPEditDialogProps {
  onOpen: () => void;
  onClose: () => void;
  open: boolean;
  rsvp: z.infer<typeof RSVPSchema>;
}

const UpdateRsvpSchema = z.object({
  status: RSVPStatusSchema.optional(),
  checkinTime: z.string().nullable().optional(),
  checkoutTime: z.string().nullable().optional(),
});

export default function RSVPEditDialog(props: RSVPEditDialogProps) {
  const { onClose, open, rsvp } = props;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    reset,
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
        userId: rsvp.userId,
        checkinTime: data.checkinTime ?? undefined,
        checkoutTime: data.checkoutTime ?? undefined,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
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
          <Stack direction="row" gap={2}>
            <Controller
              control={control}
              name="checkinTime"
              render={({ field: { value, onChange, ...rest } }) => (
                <DateTimePicker
                  value={value ? DateTime.fromISO(value) : null}
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
            <IconButton
              onClick={() => {
                reset({
                  checkinTime: null,
                });
              }}
            >
              <FaRecycle />
            </IconButton>
          </Stack>

          <Stack direction="row" gap={2}>
            <Controller
              control={control}
              name="checkoutTime"
              render={({ field: { value, onChange, ...rest } }) => (
                <DateTimePicker
                  value={value ? DateTime.fromISO(value) : null}
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
            <IconButton
              onClick={() => {
                reset({
                  checkoutTime: null,
                });
              }}
            >
              <FaRecycle />
            </IconButton>
          </Stack>
          <Typography>
            {errors.checkinTime?.message}
            {errors.checkoutTime?.message}
          </Typography>
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
