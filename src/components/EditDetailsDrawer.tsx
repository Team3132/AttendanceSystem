import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Skeleton,
  Spinner,
  Stack,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { pick } from "lodash";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSWRConfig } from "swr";
import { UpdateEventDto } from "../generated";
import { useAuthStatus, useEvent } from "../hooks";
import { deleteEvent, updateEvent } from "../utils";
import { isAdmin } from "../utils/roles";

export const EditDetailsModal: React.FC = () => {
  const { eventId } = useParams();
  const { event, isLoading, isError, mutate } = useEvent(eventId);
  const { roles } = useAuthStatus();
  const navigate = useNavigate();
  const { mutate: globalMutate } = useSWRConfig();

  const readonly = roles?.some((role) => isAdmin(role));
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
      ]);
      reset(pickedEvent);
    }
  }, [event]);

  const onSubmit = async (data: UpdateEventDto) => {
    const formData = { ...data };
    if (eventId) {
      const event = await updateEvent(eventId, formData);
      mutate(event);
      globalMutate("/api/event");
    }
  };

  return (
    <Drawer
      isOpen={true}
      placement="right"
      onClose={() => navigate("/calendar")}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerCloseButton />
          <DrawerHeader>
            {isLoading ? (
              <Skeleton>Loading</Skeleton>
            ) : readonly ? (
              `Viewing: ${event?.title}`
            ) : (
              `Editing: ${event?.title}`
            )}
          </DrawerHeader>

          <DrawerBody>
            {isLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Stack>
                <FormControl isInvalid={!!errors.title}>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <Input
                    id="title"
                    {...register("title", { required: true })}
                    readOnly={readonly}
                  />
                </FormControl>
                <FormControl
                  display="flex"
                  alignItems="center"
                  isInvalid={!!errors.allDay}
                >
                  <FormLabel htmlFor="allDay" mb="0">
                    All day
                  </FormLabel>
                  <Switch
                    id="allDay"
                    {...register("allDay")}
                    readOnly={readonly}
                  />
                </FormControl>
                {/* Start Date */}
                <Controller
                  name="startDate"
                  control={control}
                  rules={{
                    validate: {
                      isNotNull: (v) =>
                        v !== null ?? "Needs to be a valid date.",
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
                          props.field.onChange(
                            DateTime.fromISO(e.target.value).toISO()
                          )
                        }
                      />
                      {!errors.startDate ? (
                        <FormHelperText>
                          The start date of the event.
                        </FormHelperText>
                      ) : (
                        <FormErrorMessage>
                          {errors.startDate.message}
                        </FormErrorMessage>
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
                      isNotNull: (v) =>
                        v !== null ?? "Needs to be a valid date.",
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
                          props.field.onChange(
                            DateTime.fromISO(e.target.value).toISO()
                          )
                        }
                      />
                      {!errors.endDate ? (
                        <FormHelperText>
                          The end date of the event.
                        </FormHelperText>
                      ) : (
                        <FormErrorMessage>
                          {errors.endDate.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  )}
                />

                <FormControl isInvalid={!!errors.description}>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Textarea
                    id="description"
                    {...register("description")}
                    readOnly={readonly}
                  />
                  {!errors.description ? (
                    <FormHelperText>
                      The description of the event.
                    </FormHelperText>
                  ) : (
                    <FormErrorMessage>
                      {errors.description.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                navigate("/calendar");
              }}
            >
              Close
            </Button>
            <Button
              onClick={async () => {
                if (eventId) {
                  try {
                    await deleteEvent(eventId);
                  } catch (error) {
                    console.log(`Deleted Event ${eventId}`);
                  }
                  globalMutate("/api/event");
                  navigate(`/calendar`);
                }
              }}
              colorScheme="red"
            >
              Delete
            </Button>

            <Button variant="ghost" type="submit" isLoading={isSubmitting}>
              Submit
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
