import { useAuthStatus } from "@/features/auth";
import { RSVPButtonRow } from "@/features/rsvp";
import { EventResponseType } from "@/generated";
import {
  Box,
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
import { DateTime, Duration } from "luxon";
import { useParams } from "react-router-dom";
import useEvent from "../hooks/useEvent";

interface EventDetailsProps {
  event: EventResponseType;
}

export default function EventDetails() {
  const { eventId } = useParams();
  const event = useEvent(eventId);
  const auth = useAuthStatus();

  if (!event.isSuccess || !auth.isSuccess) {
    return <Spinner />;
  }

  const { hours, minutes } = Duration.fromObject({
    milliseconds:
      new Date(event.data.endDate).getTime() -
      new Date(event.data.startDate).getTime(),
  })
    .shiftTo("hours", "minutes")
    .toObject();

  return (
    <Container maxW="container.md">
      <Stack divider={<Divider />} spacing={5} my={5}>
        {event.data?.allDay ? (
          <Center>
            <Tag colorScheme={"blue"} size="md">
              All Day
            </Tag>
          </Center>
        ) : null}

        <StatGroup textAlign={"center"}>
          <Stat>
            <StatLabel>Your Status</StatLabel>
            <StatNumber py={2}>
              <RSVPButtonRow eventId={event.data.id} />
            </StatNumber>
            <StatHelpText>
              Whether or not you're coming to the event.
            </StatHelpText>
          </Stat>
        </StatGroup>
        <StatGroup>
          <Stat>
            <StatLabel>Start</StatLabel>
            <StatNumber>
              {DateTime.fromISO(event.data.startDate).toLocaleString(
                event.data.allDay
                  ? {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  : DateTime.DATETIME_MED,
              )}
            </StatNumber>
          </Stat>

          <Stat>
            <StatLabel>End</StatLabel>
            <StatNumber>
              {DateTime.fromISO(event.data.endDate).toLocaleString(
                event.data.allDay
                  ? {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  : DateTime.DATETIME_MED,
              )}
            </StatNumber>
          </Stat>
        </StatGroup>
        <StatGroup>
          <Stat>
            <StatLabel>Type</StatLabel>
            <StatNumber>{event.data?.type}</StatNumber>
            <StatHelpText>The type of the event.</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Duration</StatLabel>
            <StatNumber>
              {hours ?? 0}h {minutes ? Math.round(minutes) : 0}m
            </StatNumber>
            <StatHelpText>How long the event goes for.</StatHelpText>
          </Stat>
        </StatGroup>
        {/* <StatGroup>
        
      </StatGroup> */}
        <Box>
          <Heading size="md">Description</Heading>
          <Text>
            {event.data.description.length > 0
              ? event.data.description
              : "No description"}
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}
