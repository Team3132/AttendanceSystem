import { useAuthStatus } from "@/features/auth";
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
import { EventResponseType, UpdateEventDto } from "@generated";
import pick from "lodash.pick";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaArrowRight } from "react-icons/fa";
import {
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import useDeleteEvent from "../hooks/useDeleteEvent";
import useEvent from "../hooks/useEvent";
import useUpdateEvent from "../hooks/useUpdateEvent";

export async function loader({ request: { url }, params }: LoaderFunctionArgs) {
  const { searchParams } = new URL(url);
  const eventId = params?.eventId;

  if (!eventId) throw new Error("No event id provided");

  return {
    eventId,
  };
}

interface UpdateEventDtoForm
  extends Omit<UpdateEventDto, "startDate" | "endDate"> {
  startDate: string | Date;
  endDate: string | Date;
}

const dateTimeLocalFormat = "kkkk-LL-dd'T'HH:mm";

export function Component() {
  const { eventId } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: event, isLoading } = useEvent(eventId);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm<UpdateEventDtoForm>();
  useEffect(() => {
    if (event) {
      const existingEventData = {
        ...event,
        startDate: DateTime.fromISO(event.startDate).toFormat(
          dateTimeLocalFormat
        ),
        endDate: DateTime.fromISO(event.endDate).toFormat(dateTimeLocalFormat),
      } satisfies UpdateEventDtoForm;
      reset(existingEventData);
    }
  }, [event]);

  const { mutateAsync: updateEvent } = useUpdateEvent();

  const onSubmit = async (data: UpdateEventDtoForm) => {
    const newEventData = {
      ...data,
      startDate:
        typeof data.startDate === "string"
          ? data.startDate
          : data.startDate.toISOString(),
      endDate:
        typeof data.endDate === "string"
          ? data.endDate
          : data.endDate.toISOString(),
    };

    await updateEvent({ id: eventId, data: newEventData });
  };

  const deleteEvent = useDeleteEvent();

  return isLoading || !event ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading
        textAlign={"center"}
        mt={6}
        position="relative"
        right={0}
        bottom={"auto"}
        top={"auto"}
      >
        Editing: {event?.title}
        <Button
          rightIcon={<FaArrowRight />}
          position="absolute"
          right={0}
          bottom="auto"
          top="auto"
          as={Link}
          to={`/event/${event.id}`}
        >
          View
        </Button>
      </Heading>
      <Divider my={6} />
      <Center>
        <ButtonGroup></ButtonGroup>
      </Center>
      <Divider my={6} />
      <Stack spacing={5}>
        {/* Title */}
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
        <FormControl isInvalid={!!errors.startDate}>
          <FormLabel htmlFor="startDate">Start Date</FormLabel>
          <Input
            id="startDate"
            type="datetime-local"
            {...register("startDate", {
              valueAsDate: true,
              required: true,
            })}
          />
          {!errors.startDate ? (
            <FormHelperText>The start date of the event.</FormHelperText>
          ) : (
            <FormErrorMessage>{errors.startDate.message}</FormErrorMessage>
          )}
        </FormControl>

        {/* End Date */}
        <FormControl isInvalid={!!errors.endDate}>
          <FormLabel htmlFor="endDate">End Date</FormLabel>
          <Input
            id="endDate"
            type="datetime-local"
            {...register("endDate", {
              valueAsDate: true,
              required: true,
            })}
          />
          {!errors.endDate ? (
            <FormHelperText>The end date of the event.</FormHelperText>
          ) : (
            <FormErrorMessage>{errors.endDate.message}</FormErrorMessage>
          )}
        </FormControl>

        {/* Description */}
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

      {/* Submit */}
      <ButtonGroup>
        <Button
          onClick={async () => {
            if (event.id) {
              try {
                await deleteEvent.mutateAsync(event.id);

                navigate(`/calendar`);
                // await deleteEvent(event.id);
              } catch (error) {
                console.log(`Deleted Event ${event.id}`);
              }
            }
          }}
          isLoading={deleteEvent.isLoading}
          colorScheme="red"
        >
          Delete
        </Button>
        <Button
          variant="solid"
          colorScheme={"blue"}
          type="submit"
          isLoading={isSubmitting}
        >
          Submit
        </Button>
      </ButtonGroup>
    </form>
  );
}
