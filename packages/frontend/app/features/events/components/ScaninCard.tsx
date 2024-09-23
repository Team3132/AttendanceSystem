import { isTRPCClientError } from "@/utils/trpc";
import { LoadingButton } from "@mui/lab";
import { Paper, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { useAlert } from "react-alert";
import { z } from "zod";
import { useDisclosure } from "../../../hooks/useDisclosure";
import useZodForm, { type ZodSubmitHandler } from "../../../hooks/useZodForm";
import useScanin from "../hooks/useScanin";
import UnknownCodeModal from "./UnknownCodeModal";

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
  const [unknownCode, setUnknownCode] = useState<string | undefined>(undefined);
  const { getDisclosureProps, onOpen } = useDisclosure();

  const {
    register,
    setFocus,
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

  const onSubmit: ZodSubmitHandler<typeof ScaninSchema> = useCallback(
    async (data) => {
      try {
        await scanInMutation.mutateAsync({
          eventId,
          scancode: data.code,
        });
        reset({
          code: "",
        });
        alert.success("Scan in successful", {
          timeout: 2000,
        });
        setUnknownCode(undefined);
        setFocus("code");
      } catch (error) {
        if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND") {
          console.log(error);
          setUnknownCode(data.code);
          onOpen();
        }
      }
    },
    [alert, eventId, onOpen, reset, scanInMutation, setFocus],
  );

  const codeCreatedCallback = useCallback(
    (createdCode: string) => {
      onSubmit({
        code: createdCode,
      });
    },
    [onSubmit],
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
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
            error={!!errors.code || scanInMutation.isError}
            helperText={errors.code?.message ?? scanInMutation.error?.message}
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
      {unknownCode ? (
        <UnknownCodeModal
          code={unknownCode}
          {...getDisclosureProps()}
          successCallback={codeCreatedCallback}
        />
      ) : null}
    </Paper>
  );
}
