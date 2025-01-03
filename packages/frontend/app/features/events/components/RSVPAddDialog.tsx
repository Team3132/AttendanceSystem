import { useDisclosure } from "@/hooks/useDisclosure";
import { LoadingButton } from "@mui/lab";
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
import { keepPreviousData } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";
import useZodForm, { type ZodSubmitHandler } from "../../../hooks/useZodForm";
import useAddUserRsvp from "../hooks/useAddRsvp";
import { useInfiniteQuery } from "@tanstack/react-query";
import { usersQueryOptions } from "@/queries/users.queries";

interface RSVPAddDialogProps {
  onOpen: () => void;
  onClose: () => void;
  open: boolean;
  eventId: string;
}

const UserOptionSchema = z.object({
  label: z.string().nonempty(),
  value: z.string().nonempty(),
});

const AddUserRsvpSchema = z.object({
  userOption: UserOptionSchema.nullable().default(null),
});

export default function RSVPAddDialog(props: RSVPAddDialogProps) {
  const { onClose, open, eventId } = props;

  const { getDisclosureProps, isOpen: isAutocompleteOpen } = useDisclosure();

  const [debouncedInputValue, setInputValue] = useDebounceValue("", 500);

  const usersQuery = useInfiniteQuery({
    ...usersQueryOptions.userList({
      search: debouncedInputValue,
      limit: 10,
    }),
    enabled: isAutocompleteOpen,
    placeholderData: keepPreviousData,
  });

  const userOption = useMemo(
    () =>
      usersQuery.data?.pages
        ?.flatMap((page) => page.items)
        .map((user) => ({
          label: user.username,
          value: user.id,
        })) ?? [],
    [usersQuery.data],
  );

  const {
    formState: { isSubmitting },
    handleSubmit,
    control,
    reset,
    setError,
  } = useZodForm({
    schema: AddUserRsvpSchema,
    defaultValues: {
      userOption: null,
    },
  });

  const addUserEventRsvpMutation = useAddUserRsvp();

  const onSubmit: ZodSubmitHandler<typeof AddUserRsvpSchema> = async (data) => {
    try {
      const userOptionVal = data.userOption?.value;

      if (!userOptionVal) {
        setError("userOption", {
          message: "Please select a user",
        });
        return;
      }

      await addUserEventRsvpMutation.mutateAsync({
        data: {
          eventId,
          userId: userOptionVal,
        },
      });
      reset();
      onClose();
    } catch (error) {
      if (error instanceof TRPCClientError) {
        setError("userOption", {
          message: error.message,
        });
      } else {
        setError("userOption", {
          message: "An unknown error occurred",
        });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>Add an empty RSVP for a user</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will add an empty RSVP for a user. This is useful if you want to
          add a user to the event, but they haven&apos;t RSVP&apos;d yet.
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
                onInputChange={(_event, value) => {
                  setInputValue(value);
                }}
                loading={usersQuery.isFetching}
                {...getDisclosureProps()}
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton type="submit" disabled={isSubmitting}>
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
