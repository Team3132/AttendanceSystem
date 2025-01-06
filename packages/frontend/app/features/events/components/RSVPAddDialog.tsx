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
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";
import useZodForm, { type ZodSubmitHandler } from "../../../hooks/useZodForm";
import useAddUserRsvp from "../hooks/useAddRsvp";
import { useInfiniteQuery } from "@tanstack/react-query";
import { usersQueryOptions } from "@/queries/users.queries";
import { RSVPStatusUpdateSchema } from "@/api/index";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import ControlledSelect from "@/components/ControlledSelect";
import { eventQueryKeys } from "@/api/queryKeys";
import { eventQueryOptions } from "@/queries/events.queries";
import { parseDate } from "@/utils/date";
import ControlledDateTime from "@/components/ControlledDateTime";
import ControlledAutocomplete from "@/components/ControlledAutocomplete";

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
  checkinTime: z.string().nullable().optional(),
  checkoutTime: z.string().nullable().optional(),
  status: z.union([RSVPStatusUpdateSchema, z.literal("")]).default(""),
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
  const eventRSVPs = useSuspenseQuery(eventQueryOptions.eventRsvps(eventId));
  const eventDetails = useSuspenseQuery(
    eventQueryOptions.eventDetails(eventId),
  );

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
    setValue,
    getValues,
  } = useZodForm({
    schema: AddUserRsvpSchema,
    defaultValues: {
      userOption: null,
      checkinTime: null,
      checkoutTime: null,
      status: "",
    },
  });

  const addUserEventRsvpMutation = useAddUserRsvp();

  const onSubmit: ZodSubmitHandler<typeof AddUserRsvpSchema> = async (data) => {
    try {
      const { userOption, status, ...rest } = data;
      const userOptionVal = userOption?.value;

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
          status: status === "" ? undefined : status,
          ...rest,
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

  const handleSelect = (
    data: {
      value: string;
    } | null,
  ) => {
    const selectedUserId = data?.value;
    const existingUserRsvp = eventRSVPs.data?.find(
      (u) => u.userId === selectedUserId,
    );
    if (selectedUserId && existingUserRsvp) {
      const existingValues = getValues();
      if (!existingValues.checkinTime && existingUserRsvp.checkinTime) {
        setValue("checkinTime", parseDate(existingUserRsvp.checkinTime));
      }
      if (!existingValues.checkoutTime) {
        setValue("checkoutTime", parseDate(existingUserRsvp.checkoutTime));
      }

      if (!existingValues.status && existingUserRsvp.status !== "ATTENDED") {
        setValue("status", existingUserRsvp.status ?? undefined);
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
      <DialogTitle>Add or Update an RSVP</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will create or update an RSVP for the event for the selected
          user.
        </DialogContentText>
        <Stack
          gap={2}
          sx={{
            mt: 2,
          }}
        >
          <ControlledAutocomplete
            control={control}
            name="userOption"
            label="User"
            placeholder="Select a user"
            helperText="Select the user to RSVP for"
            options={userOption}
            onInputChange={(_, value) => setInputValue(value)}
            loading={usersQuery.isFetching}
            required
            onChange={handleSelect}
            {...getDisclosureProps()}
          />
          <Stack direction="row" gap={2}>
            <ControlledDateTime
              control={control}
              name="checkinTime"
              label="Checkin Time"
            />
            <ControlledDateTime
              control={control}
              name="checkoutTime"
              label="Checkout Time"
            />
          </Stack>
          {/* Time Presets */}
          <Stack direction="row" gap={2} justifyContent={"space-evenly"}>
            {/* Set start and end to event */}
            <Button
              onClick={() => {
                setValue(
                  "checkinTime",
                  parseDate(eventDetails.data?.startDate),
                );
                setValue("checkoutTime", parseDate(eventDetails.data?.endDate));
              }}
            >
              Set to Event
            </Button>
            {/* Set start to now */}
            <Button
              onClick={() => {
                setValue("checkinTime", DateTime.now().toISO());
              }}
            >
              Set Start to Now
            </Button>
            {/* Set end to now (start to event start if undef) */}
            <Button
              onClick={() => {
                if (!getValues().checkinTime) {
                  setValue(
                    "checkinTime",
                    parseDate(eventDetails.data?.startDate),
                  );
                }
                setValue("checkoutTime", DateTime.now().toISO());
              }}
            >
              Set End to Now
            </Button>
            {/* Clear */}
            <Button
              onClick={() => {
                setValue("checkinTime", null);
                setValue("checkoutTime", null);
              }}
            >
              Clear
            </Button>
          </Stack>
          <ControlledSelect
            control={control}
            name="status"
            label="Status"
            placeholder="Select a status"
            helperText="Select the status of the RSVP"
            options={[
              { label: "", value: "" },
              { label: "No", value: "NO" },
              { label: "Maybe", value: "MAYBE" },
              { label: "Yes", value: "YES" },
              { label: "Late", value: "LATE" },
            ]}
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
