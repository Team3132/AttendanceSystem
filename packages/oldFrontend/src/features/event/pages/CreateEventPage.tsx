import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
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
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import useCreateEvent from "../hooks/useCreateEvent";

const dateTimeLocalFormat = "kkkk-LL-dd'T'HH:mm";

export async function loader({ request: { url } }: LoaderFunctionArgs) {
  const { searchParams } = new URL(url);
  const startDateQuery = searchParams.get("startDate");
  const startDate = startDateQuery
    ? DateTime.fromISO(startDateQuery).toFormat(dateTimeLocalFormat)
    : DateTime.now().toFormat(dateTimeLocalFormat);

  const endQuery = searchParams.get("endDate");
  const endDate = endQuery
    ? DateTime.fromISO(endQuery).toFormat(dateTimeLocalFormat)
    : DateTime.now().toFormat(dateTimeLocalFormat);

  const allDayQuery = searchParams.get("allDay");
  const allDay: boolean = allDayQuery
    ? allDayQuery === "true"
      ? true
      : allDayQuery === "false"
      ? false
      : false
    : false;

  const role = searchParams.get("role") ?? undefined;

  const eventTypeQuery = searchParams.get("eventType") ?? undefined;

  const eventType = eventTypeQuery
    ? eventTypeQuery === CreateEventDto.type.OUTREACH
      ? CreateEventDto.type.OUTREACH
      : eventTypeQuery === CreateEventDto.type.REGULAR
      ? CreateEventDto.type.REGULAR
      : eventTypeQuery === CreateEventDto.type.SOCIAL
      ? CreateEventDto.type.SOCIAL
      : undefined
    : undefined;

  const description = searchParams.get("description") ?? undefined;

  const eventNameQuery = searchParams.get("eventName") ?? undefined;

  return {
    eventNameQuery,
    description,
    eventType,
    role,
    allDay,
    startDate,
    endDate,
  };
}

type CreateEventDtoForm = Omit<CreateEventDto, "startDate" | "endDate"> & {
  startDate: Date | string;
  endDate: Date | string;
};

export function Component() {
  const {
    allDay,
    startDate,
    endDate,
    role,
    eventType,
    description,
    eventNameQuery,
  } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<CreateEventDtoForm>({
    defaultValues: {
      title: eventNameQuery ?? "Event Title",
      type: eventType,
      startDate,
      endDate,
      allDay,
      roles: role ? [role] : undefined,
      description,
    },
  });

  const { mutateAsync: createEvent } = useCreateEvent();

  const onSubmit = async (data: CreateEventDtoForm) => {
    console.log(data);
    const event = await createEvent({
      ...data,
      startDate:
        typeof data.startDate === "string"
          ? data.startDate
          : data.startDate.toISOString(),
      endDate:
        typeof data.endDate === "string"
          ? data.endDate
          : data.endDate.toISOString(),
    });
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
        <HStack>
          <FormControl isInvalid={!!errors.startDate}>
            <FormLabel htmlFor="startDate">Start Date</FormLabel>
            <Input
              id="startDate"
              type="datetime-local"
              {...register("startDate", {
                valueAsDate: true,
              })}
            />
            {!errors.startDate ? (
              <FormHelperText>The start date of the event.</FormHelperText>
            ) : (
              <FormErrorMessage>{errors.startDate.message}</FormErrorMessage>
            )}
          </FormControl>
        </HStack>

        {/* End Date */}
        <HStack>
          <FormControl isInvalid={!!errors.endDate}>
            <FormLabel htmlFor="endDate">End Date</FormLabel>
            <Input
              id="endDate"
              type="datetime-local"
              {...register("endDate", {
                valueAsDate: true,
              })}
            />
            {!errors.endDate ? (
              <FormHelperText>The end date of the event.</FormHelperText>
            ) : (
              <FormErrorMessage>{errors.endDate.message}</FormErrorMessage>
            )}
          </FormControl>
          {/* <FormControl isInvalid={!!errors.endTime}>
            <FormLabel htmlFor="endTime">End Time</FormLabel>
            <Input
              id="endTime"
              type="time"
              {...register("endTime", {
                valueAsDate: true,
              })}
            />
            {!errors.endTime ? (
              <FormHelperText>The end time of the event.</FormHelperText>
            ) : (
              <FormErrorMessage>{errors.endTime.message}</FormErrorMessage>
            )}
          </FormControl> */}
        </HStack>

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
}

export default Component;
