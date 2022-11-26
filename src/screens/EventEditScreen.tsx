import {
  Button,
  ButtonGroup,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Spinner,
  Stack,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { Event, UpdateEventDto } from "@generated";
import {
  useAuthStatus,
  useDeleteEvent,
  useEvent,
  useUpdateEvent,
} from "@hooks";
import pick from "lodash.pick";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export const EventEditScreen: React.FC = () => {
  const { eventId } = useParams();
  const { event, isLoading, isError } = useEvent(eventId);
  const { roles } = useAuthStatus();
  const navigate = useNavigate();
  // const { mutate: globalMutate } = useSWRConfig();
  const { isAdmin } = useAuthStatus();

  const readonly = !isAdmin;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm<UpdateEventDto>();
  useEffect(() => {
    if (event) {
      const pickedEvent = pick(event, [
        "description",
        "title",
        "startDate",
        "endDate",
        "allDay",
        "type",
      ]);
      reset(pickedEvent);
    }
  }, [event]);

  const { mutateAsync: updateEvent } = useUpdateEvent();

  const onSubmit = async (data: UpdateEventDto) => {
    if (event?.id) {
      await updateEvent({ id: event.id, data });
    }
  };

  const { mutateAsync: deleteEvent } = useDeleteEvent();

  return isLoading || !event ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading textAlign={"center"} mt={6}>
        Editing: {event?.title}
      </Heading>
      <Divider my={6} />
      <Center>
        <ButtonGroup>
          <Button
            onClick={async () => {
              if (event.id) {
                try {
                  await deleteEvent(event.id);

                  navigate(`/calendar`);
                  // await deleteEvent(event.id);
                } catch (error) {
                  console.log(`Deleted Event ${event.id}`);
                }
              }
            }}
            colorScheme="red"
          >
            Delete
          </Button>
        </ButtonGroup>
      </Center>
      <Divider my={6} />
      <Stack spacing={5}>
        {/* Title */}
        <FormControl isInvalid={!!errors.title}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            {...register("title", { required: true })}
            readOnly={readonly}
          />
        </FormControl>

        {/* All Day */}
        <FormControl
          display="flex"
          alignItems="center"
          isInvalid={!!errors.allDay}
        >
          <FormLabel htmlFor="allDay" mb="0">
            All day
          </FormLabel>
          <Switch id="allDay" {...register("allDay")} readOnly={readonly} />
        </FormControl>

        {/* Select Type */}
        <FormControl>
          <FormLabel>Event Type</FormLabel>
          <Select
            placeholder="Select event type"
            defaultValue={Event.type.REGULAR}
            {...register("type")}
          >
            <option value={Event.type.REGULAR}>Regular</option>
            <option value={Event.type.SOCIAL}>Social</option>
            <option value={Event.type.OUTREACH}>Outreach</option>
          </Select>
        </FormControl>

        {/* Start Date */}
        <Controller
          name="startDate"
          control={control}
          rules={{
            validate: {
              isNotNull: (v) => v !== null ?? "Needs to be a valid date.",
            },
          }}
          render={(props) => (
            <FormControl isInvalid={!!errors.startDate}>
              <FormLabel htmlFor="startDate">Start Date</FormLabel>
              <Input
                id="startDate"
                type="datetime-local"
                readOnly={readonly}
                {...props.field}
                value={
                  props.field.value
                    ? DateTime.fromISO(props.field.value).toISO({
                        includeOffset: false,
                      })
                    : undefined
                }
                onChange={(e) =>
                  props.field.onChange(DateTime.fromISO(e.target.value).toISO())
                }
              />
              {!errors.startDate ? (
                <FormHelperText>The start date of the event.</FormHelperText>
              ) : (
                <FormErrorMessage>{errors.startDate.message}</FormErrorMessage>
              )}
            </FormControl>
          )}
        />

        {/* End Date */}
        <Controller
          name="endDate"
          control={control}
          rules={{
            validate: {
              isNotNull: (v) => v !== null ?? "Needs to be a valid date.",
            },
          }}
          render={(props) => (
            <FormControl isInvalid={!!errors.endDate}>
              <FormLabel htmlFor="endDate">End Date</FormLabel>
              <Input
                readOnly={readonly}
                id="endDate"
                type="datetime-local"
                {...props.field}
                value={
                  props.field.value
                    ? DateTime.fromISO(props.field.value).toISO({
                        includeOffset: false,
                      })
                    : undefined
                }
                onChange={(e) =>
                  props.field.onChange(DateTime.fromISO(e.target.value).toISO())
                }
              />
              {!errors.endDate ? (
                <FormHelperText>The end date of the event.</FormHelperText>
              ) : (
                <FormErrorMessage>{errors.endDate.message}</FormErrorMessage>
              )}
            </FormControl>
          )}
        />

        {/* Description */}
        <FormControl isInvalid={!!errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            {...register("description")}
            readOnly={readonly}
          />
          {!errors.description ? (
            <FormHelperText>The description of the event.</FormHelperText>
          ) : (
            <FormErrorMessage>{errors.description.message}</FormErrorMessage>
          )}
        </FormControl>
      </Stack>

      {/* Submit */}
      <Button
        variant="solid"
        colorScheme={"blue"}
        type="submit"
        isLoading={isSubmitting}
      >
        Submit
      </Button>
    </form>
  );
};

export default EventEditScreen;
