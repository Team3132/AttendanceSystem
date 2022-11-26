import {
  Button,
  Center,
  Container,
  Divider,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { AttendedList } from "@components";
import { ScaninDto } from "@generated";
import { useEvent, useEventAttendanceStatuses, useScanin } from "@hooks";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export const ScanIn: React.FC = () => {
  const { eventId } = useParams();
  const { event } = useEvent(eventId);
  const { attendances, isLoading, isError } =
    useEventAttendanceStatuses(eventId);
  const navigate = useNavigate();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ScaninDto>();

  const { mutateAsync: scanin } = useScanin();

  const onSubmit = async (data: ScaninDto) => {
    if (eventId) {
      await scanin({ eventId, scan: data });

      reset();
    }
  };
  return (
    <>
      <Heading textAlign={"center"} mt={6}>
        Scanin: {event?.title}
      </Heading>
      <Divider my={6} />
      <Container maxW={"container.md"}>
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputGroup>
                <Input
                  {...register("code")}
                  placeholder={"Enter your code here..."}
                />
                <InputRightElement width="5rem">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    h="1.75rem"
                    size="sm"
                  >
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
            </form>

            <Stack>
              <AttendedList eventId={eventId} />
            </Stack>
          </>
        )}
      </Container>

      <Button
        colorScheme="blue"
        mr={3}
        onClick={() => {
          navigate("/calendar");
        }}
      >
        Close
      </Button>
    </>
  );
};
export default ScanIn;
