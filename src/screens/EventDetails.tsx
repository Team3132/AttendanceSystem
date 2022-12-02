import {
  Center,
  Container,
  Divider,
  Heading,
  Spinner,
  Stack,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  Text,
} from "@chakra-ui/react";
import { RSVPList } from "@components";
import { useEvent } from "@hooks";
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";

export const EventDetailsScreen: React.FC = () => {
  const { eventId } = useParams();
  const { event, isLoading, isError } = useEvent(eventId);

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
            {/* Event type */}
            <StatGroup>
              <Stat textAlign={"center"}>
                <StatLabel>Type</StatLabel>
                <StatNumber>{event?.type}</StatNumber>
                <StatHelpText>The type of the event.</StatHelpText>
              </Stat>
            </StatGroup>

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

            <RSVPList eventId={event?.id} />
          </Stack>
        </Container>
      )}
    </>
  );
};

export default EventDetailsScreen;
