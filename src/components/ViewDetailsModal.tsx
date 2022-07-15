import {
  Center,
  Container,
  Divider,
  Heading,
  Spinner,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Tag,
  Text,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStatus, useEvent, useEventRSVPStatus } from "../hooks";

export const ViewDetailsModal: React.FC = () => {
  const { eventId } = useParams();
  const { event, isLoading, isError, mutate } = useEvent(eventId);
  const {
    rsvp,
    isLoading: isRSVPStatusLoading,
    isError: isRSVPStatusError,
  } = useEventRSVPStatus(event?.id);
  const { roles } = useAuthStatus();
  const navigate = useNavigate();

  return (
    <>
      {isLoading || !event ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Container maxW="container.md">
          <Stack spacing={5} divider={<Divider />}>
            <Heading textAlign={"center"} mt={6}>
              {event?.title}
              <br />
              {event?.allDay ? (
                <Tag colorScheme={"blue"} size="md">
                  All Day
                </Tag>
              ) : null}
            </Heading>
            <StatGroup textAlign={"center"}>
              <Stat>
                <StatLabel>Start DateTime</StatLabel>
                <StatNumber>
                  {DateTime.fromISO(event.startDate).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </StatNumber>
              </Stat>

              <Stat>
                <StatLabel>End DateTime</StatLabel>
                <StatNumber>
                  {DateTime.fromISO(event.endDate).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </StatNumber>
              </Stat>
            </StatGroup>

            <Stack textAlign={"center"}>
              <Heading size="md">Description</Heading>
              <Text>
                {event.description.length > 0
                  ? event.description
                  : "No description"}
              </Text>
            </Stack>
            {/* <RSVPButtonRow eventId={event?.id} /> */}
            {/* <AttendanceButtonRow eventId={event?.id} /> */}
            {/* <RSVPList eventId={event?.id} /> */}
          </Stack>
        </Container>
      )}
    </>
  );
};
