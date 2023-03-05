import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { CreateEventDto, EventResponseType } from "@generated";
import { DateTime } from "luxon";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCreateEvent from "../hooks/useCreateEvent";

const CreateEventScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const startDateQuery = searchParams.get("startDate");
  const startDate = startDateQuery
    ? new Date(startDateQuery).toISOString()
    : new Date().toISOString();

  const endQuery = searchParams.get("endDate");
  const endDate = endQuery
    ? new Date(endQuery).toISOString()
    : new Date().toISOString();

  const allDayQuery = searchParams.get("allDay");
  const allDay: boolean = allDayQuery
    ? allDayQuery === "true"
      ? true
      : allDayQuery === "false"
      ? false
      : false
    : false;

  const role = searchParams.get("role");

  const eventTypeQuery = searchParams.get("eventType");

  const eventType = eventTypeQuery
    ? eventTypeQuery === CreateEventDto.type.OUTREACH
      ? CreateEventDto.type.OUTREACH
      : eventTypeQuery === CreateEventDto.type.REGULAR
      ? CreateEventDto.type.REGULAR
      : eventTypeQuery === CreateEventDto.type.SOCIAL
      ? CreateEventDto.type.SOCIAL
      : undefined
    : undefined;

  const eventNameQuery = searchParams.get("eventName")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm<CreateEventDto>({
    defaultValues: {
      title: eventNameQuery ?? "Event Title",
      type: eventType,
      startDate,
      endDate,
      allDay,
      roles: role ? [role] : undefined
    },
  });

  const { mutateAsync: createEvent } = useCreateEvent();

  const onSubmit = async (data: CreateEventDto) => {
    const event = await createEvent(data);
    navigate(`/event/${event.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading>Create an event</Heading>

      <Stack>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" {...register("title", { required: true })} />
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
          <Switch id="allDay" {...register("allDay")} />
        </FormControl>
        {/* Select Type */}
        <FormControl>
          <FormLabel>Event Type</FormLabel>
          <Select
            placeholder="Select event type"
            defaultValue={EventResponseType.type.REGULAR}
            {...register("type")}
          >
            <option value={EventResponseType.type.REGULAR}>Regular</option>
            <option value={EventResponseType.type.SOCIAL}>Social</option>
            <option value={EventResponseType.type.OUTREACH}>Outreach</option>
          </Select>
        </FormControl>

        {/* Start Date */}
        <Controller
          name="startDate"
          control={control}
          rules={{
            required: true,
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
            required: true,
            validate: {
              isNotNull: (v) => v !== null ?? "Needs to be a valid date.",
            },
          }}
          render={(props) => (
            <FormControl isInvalid={!!errors.endDate}>
              <FormLabel htmlFor="endDate">End Date</FormLabel>
              <Input
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

        <FormControl isInvalid={!!errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea id="description" {...register("description")} />
          {!errors.description ? (
            <FormHelperText>The description of the event.</FormHelperText>
          ) : (
            <FormErrorMessage>{errors.description.message}</FormErrorMessage>
          )}
        </FormControl>
      </Stack>

      <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
};

export default CreateEventScreen;
