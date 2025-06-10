import ControlledTextField from "@/components/ControlledTextField";
import useSelfCheckin from "@/features/events/hooks/useSelfCheckin";
import useZodForm from "@/hooks/useZodForm";
import { SelfCheckinSchema } from "@/server/schema";
import { isServerError } from "@/server/utils/errors";
import { Button, Paper, Stack, Typography } from "@mui/material";
import {, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute({
  head: () => ({
    meta: [
      {
        title: "Event - Check-In",
      },
    ],
  }),
  component: Component,
});

function Component() {
  const { eventId } = Route.useParams();
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useZodForm({
    schema: SelfCheckinSchema,
    defaultValues: {
      secret: "",
      eventId,
    },
  });

  const checkinMutation = useSelfCheckin();

  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await checkinMutation.mutateAsync({
        data: { secret: data.secret, eventId },
      });

      navigate({
        to: "/",
      });
    } catch (e) {
      if (isServerError(e)) {
        console.error(e);
      }
    }
  });

  return (
    <Stack gap={2}>
      <Paper sx={{ p: 2 }} component={"form"} onSubmit={onSubmit}>
        <Stack gap={2}>
          <Typography variant="h4" textAlign={"center"}>
            Event Check In
          </Typography>
          <Typography variant="body1" textAlign={"center"}>
            Check in for the event using the code displayed at the event by
            entering it below. Or, use your phone's camera to scan the QR code.
          </Typography>
          <ControlledTextField
            label="Event Code"
            variant="outlined"
            fullWidth
            name="secret"
            control={control}
            rules={{ required: "This field is required" }}
            required
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            loading={isSubmitting}
          >
            Check In
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
