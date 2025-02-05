import { isTRPCClientError } from "@/utils/trpc";
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useCallback, useState } from "react";
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

const PaddedPaper = styled(Paper)({
  padding: 2,
});

export default function ScaninCard(props: ScaninCardProps) {
  const { eventId } = props;
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
          data: { eventId, scancode: data.code },
        });
        reset({
          code: "",
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
    [eventId, onOpen, reset, scanInMutation, setFocus],
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
    <PaddedPaper>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
          >
            Scan In
          </Button>
        </Stack>
      </Stack>
      {unknownCode ? (
        <UnknownCodeModal
          code={unknownCode}
          {...getDisclosureProps()}
          successCallback={codeCreatedCallback}
        />
      ) : null}
    </PaddedPaper>
  );
}
