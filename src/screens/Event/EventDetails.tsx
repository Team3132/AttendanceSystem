import { EventResponseType } from "@/generated";
import {
  Container,
  Divider,
  Heading,
  Stack,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  Text,
} from "@chakra-ui/react";
import { DateTime } from "luxon";

interface EventDetailsProps {
  event: EventResponseType;
}

export default function EventDetails(props: EventDetailsProps) {
  const { event } = props;

  return (
    <Container maxW="container.md">
      <Stack spacing={5} divider={<Divider />}>
        <StatGroup>
          <Stat textAlign={"center"}>
            <StatLabel>Type</StatLabel>
            <StatNumber>
              {event?.type}{" "}
              {event?.allDay ? (
                <Tag colorScheme={"blue"} size="md">
                  All Day
                </Tag>
              ) : null}
            </StatNumber>
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
      </Stack>
    </Container>
  );
}
