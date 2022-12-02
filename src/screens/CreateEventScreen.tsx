import { api } from "@/client";
import { useCreateEvent } from "@/hooks/events";
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
import { CreateEventDto, Event } from "@generated";
import { DateTime } from "luxon";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

export const CreateEventScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
      title: "Event Title",
      startDate:
        searchParams.get("startDate") ?? new Date(Date.now()).toISOString(),
      endDate:
        searchParams.get("endDate") ?? new Date(Date.now()).toISOString(),
      allDay: !!searchParams.get("allDay") ?? false,
    },
  });

  const { mutateAsync: createEvent } = useCreateEvent();

  const onSubmit = async (data: CreateEventDto) => {
    const event = await api.event.createEvent(data);
    await createEvent(data);
    navigate(`/event/${event.id}/view`);
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
