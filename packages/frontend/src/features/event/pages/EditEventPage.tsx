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
import { Link, useNavigate, useParams } from "react-router-dom";
import useDeleteEvent from "../hooks/useDeleteEvent";
import useEvent from "../hooks/useEvent";
import useUpdateEvent from "../hooks/useUpdateEvent";

export default function EditEventPage() {
  const { eventId } = useParams();
  const { data: event, isLoading, isError } = useEvent(eventId);
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
                      }) ?? ""
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
                      }) ?? ""
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
