import { Paper, Stack, TextField, Typography } from "@mui/material";
import { z } from "zod";
import useZodForm from "../../../hooks/useZodForm";
import { LoadingButton } from "@mui/lab";
import useScanin from "../hooks/useScanin";
import { useAlert } from "react-alert";

interface ScaninCardProps {
  eventId: string;
}

const ScaninSchema = z.object({
  code: z
    .string()
    .nonempty()
    .regex(/^[a-zA-Z0-9]+$/),
});

export default function ScaninCard(props: ScaninCardProps) {
  const { eventId } = props;
  const alert = useAlert();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useZodForm({
    schema: ScaninSchema,
    defaultValues: {
      code: "",
    },
  });

  const scanInMutation = useScanin();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await scanInMutation.mutateAsync({
        eventId,
        code: data.code,
      });
      reset({
        code: "",
      });
      alert.success("Scan in successful", {
        timeout: 2000,
      });
    } catch (error) {
      reset({
        code: "",
      });
      alert.error("Scan in failed", {
        timeout: 2000,
      });
    }
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Stack gap={2} component={"form"} onSubmit={onSubmit}>
        <Typography variant="h5" textAlign={"center"}>
          Scan In
        </Typography>
        <Stack
          gap={2}
          sx={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TextField
            {...register("code")}
            label="Scan In Code"
            variant="outlined"
            disabled={isSubmitting}
            error={!!errors.code}
            helperText={errors.code?.message}
            autoFocus
          />
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
          >
            Scan In
          </LoadingButton>
        </Stack>
      </Stack>
    </Paper>
  );
}
