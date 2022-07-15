import {
  Button,
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
  Stack,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSWRConfig } from "swr";
import { CreateEventDto } from "../generated";
import { createEvent } from "../utils";

export const CreateEventDrawer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate: globalMutate } = useSWRConfig();
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
      allDay: false,
    },
  });

  const onSubmit = async (data: CreateEventDto) => {
    const event = await createEvent(data);
    navigate(`/event/${event.id}/view`);
    globalMutate("/api/event");
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
          <DrawerHeader>Create an event</DrawerHeader>

          <DrawerBody>
            <Stack>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input id="title" {...register("title", { required: true })} />
              </FormControl>
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
                <Textarea id="description" {...register("description")} />
                {!errors.description ? (
                  <FormHelperText>The description of the event.</FormHelperText>
                ) : (
                  <FormErrorMessage>
                    {errors.description.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => navigate("/calendar")}
            >
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
              Submit
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
