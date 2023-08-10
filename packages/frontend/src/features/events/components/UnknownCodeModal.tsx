import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import useZodForm from "../../../hooks/useZodForm";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import userApi from "../../../api/query/user.api";
import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import useCreateScancode from "../../user/hooks/useCreateScancode";
import { ApiError } from "../../../api/generated";
import useScanin from "../hooks/useScanin";

interface UnknownCodeModalProps {
  code: string;
  eventId: string;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const UserOptionSchema = z.object({
  label: z.string().nonempty(),
  value: z.string().nonempty(),
});

const RegisterNewCodeFormSchema = z.object({
  code: z
    .string()
    .nonempty({
      message: "Scancode code cannot be empty",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Scancode code must be alphanumeric",
    })
    .min(6),
  userOption: UserOptionSchema.nullable().default(null),
});

export default function UnknownCodeModal(props: UnknownCodeModalProps) {
  const { code, open, onClose, eventId } = props;
  const usersQuery = useQuery(userApi.getUsers);

  const userOption = useMemo(
    () =>
      usersQuery.data?.map((user) => ({
        label: user.username,
        value: user.id,
      })) || [],
    [usersQuery.data],
  );

  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    control,
    setError,
  } = useZodForm({
    schema: RegisterNewCodeFormSchema,
    defaultValues: RegisterNewCodeFormSchema.parse({
      code,
    }),
  });

  const createScancodeMutation = useCreateScancode();
  const scaninMutation = useScanin();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createScancodeMutation.mutateAsync({
        code: data.code,
        userId: data.userOption?.value,
      });
      scaninMutation.mutate({
        eventId,
        code: data.code,
      });

      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setError("code", {
          message: error.body.message,
        });
      } else {
        setError("code", {
          message: "An unknown error occurred",
        });
      }
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
        <DialogContentText>
          To register a new code, please select a user to associate it with.
        </DialogContentText>
        <Stack
          gap={2}
          sx={{
            mt: 2,
          }}
        >
          <Controller
            control={control}
            name="userOption"
            render={({
              field: { onChange, ...rest },
              fieldState: { error },
            }) => (
              <Autocomplete
                options={userOption}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    label="User"
                    helperText={error?.message}
                    error={!!error}
                    placeholder="Select a user"
                  />
                )}
                onChange={(_event, data) => {
                  onChange(data);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                {...rest}
              />
            )}
          />

          <TextField
            {...register("code")}
            label="Code"
            required
            helperText={
              errors.code?.message ?? "Scan the card you want to add."
            }
            error={!!errors.code}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton type="submit" disabled={isSubmitting}>
          Register
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
