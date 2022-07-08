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
  Flex,
  IconButton,
  Input,
  Spacer,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { EventService, ScaninDto } from "../generated";
import { useEvent, useEventAttendanceStatuses } from "../hooks";
import { AttendedList } from "./AttendedList";

export const ScanIn: React.FC = () => {
  const { eventId } = useParams();
  const { event } = useEvent(eventId);
  const { attendances, isLoading, isError, mutate } =
    useEventAttendanceStatuses(eventId);
  // const { roles } = useAuthStatus();
  const navigate = useNavigate();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ScaninDto>();

  const onSubmit = async (data: ScaninDto) => {
    if (eventId) {
      await EventService.eventControllerScaninEvent(eventId, data);

      mutate();

      reset();
    }
  };
  return (
    <Drawer
      isOpen={true}
      placement="right"
      onClose={() => navigate("/calendar")}
      size="full"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {isLoading ? "Loading" : `Scanin: ${event?.title}`}
        </DrawerHeader>

        <DrawerBody>
          {isLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex>
                  <Input
                    {...register("code")}
                    placeholder={"Paste your code here..."}
                  />
                  <Spacer />
                  <IconButton
                    aria-label="Add scancode"
                    type="submit"
                    isLoading={isSubmitting}
                  />
                </Flex>
              </form>

              <Stack>
                <AttendedList eventId={eventId} />
              </Stack>
            </>
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
