import { Paper, Stack, TextField, Typography } from "@mui/material";
import { z } from "zod";
import useZodForm from "../../../hooks/useZodForm";
import { LoadingButton } from "@mui/lab";
import useScanin from "../hooks/useScanin";
import { ApiError } from "../../../api/generated";

interface ScaninCardProps {
  eventId: string;
}

const ScaninSchema = z.object({
  code: z.string(),
});

export default function ScaninCard(props: ScaninCardProps) {
  const { eventId } = props;

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
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
    } catch (error) {
      if (error instanceof ApiError) {
        setError("code", {
          message: error.body.message,
        });
      }
      reset({
        code: "",
      });
    }
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Stack gap={2}>
        <Typography variant="h5" textAlign={"center"}>
          Scan In
        </Typography>
        <Stack
          gap={2}
          sx={{
            flexDirection: "row",
            justifyContent: "center",
          }}
          component={"form"}
          onSubmit={onSubmit}
        >
          <TextField
            {...register("code")}
            label="Scan In Code"
            variant="outlined"
            disabled={isSubmitting}
            error={!!errors.code}
            helperText={errors.code?.message}
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
