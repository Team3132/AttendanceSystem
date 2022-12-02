import {
  Button,
  ButtonGroup,
  Center,
  Container,
  Divider,
  Heading,
  IconButton,
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
import { useEvent, useIsAdmin } from "@hooks";
import { DateTime } from "luxon";
import { FaArrowRight, FaCamera } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

export const EventDetailsScreen: React.FC = () => {
  const { eventId } = useParams();
  const { event, isLoading, isError } = useEvent(eventId);
  const { isAdmin } = useIsAdmin();
  return (
    <>
      {isLoading || !event ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Container maxW="container.md">
          <Stack spacing={5} divider={<Divider />}>
            <Heading textAlign={"center"} mt={6} w="100%" position={"relative"}>
              {event?.title}
              {isAdmin && (
                <ButtonGroup
                  right={0}
                  bottom="auto"
                  top="auto"
                  position="absolute"
                >
                  <IconButton
                    aria-label="scancodes"
                    as={Link}
                    to={`/event/${event.id}/scanin`}
                  >
                    <FaCamera />
                  </IconButton>
                  <Button
                    rightIcon={<FaArrowRight />}
                    as={Link}
                    to={`/event/${event.id}/edit`}
                  >
                    Edit
                  </Button>
                </ButtonGroup>
              )}
            </Heading>
            {/* Event type */}
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

            <RSVPList eventId={event?.id} />
          </Stack>
        </Container>
      )}
    </>
  );
};

export default EventDetailsScreen;
