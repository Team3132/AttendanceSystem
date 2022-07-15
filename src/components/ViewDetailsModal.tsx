import {
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStatus, useEvent, useEventRSVPStatus } from "../hooks";
import { RSVPButtonRow } from "./RSVPButtonRow";
import { RSVPList } from "./RSVPList";

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
      <Heading textAlign={"center"} mt={6}>
        Viewing: {event?.title}
      </Heading>
      <Divider my={6} />

      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Stack>
          <FormControl>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input id="title" readOnly={true} value={event?.title} />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="allDay" mb="0">
              All day
            </FormLabel>
            <Switch id="allDay" readOnly={true} isChecked={event?.allDay} />
          </FormControl>
          {/* Start Date */}
          <FormControl>
            <FormLabel htmlFor="startDate">Start Date</FormLabel>
            <Input
              id="startDate"
              type="datetime-local"
              readOnly={true}
              value={
                event?.startDate
                  ? DateTime.fromISO(event?.startDate).toISO({
                      includeOffset: false,
                    })
                  : undefined
              }
            />
          </FormControl>
          {/* End Date */}
          <FormControl>
            <FormLabel htmlFor="endDate">End Date</FormLabel>
            <Input
              readOnly={true}
              id="endDate"
              type="datetime-local"
              value={
                event?.endDate
                  ? DateTime.fromISO(event?.endDate).toISO({
                      includeOffset: false,
                    })
                  : undefined
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              readOnly={true}
              value={event?.description}
            />
          </FormControl>
          <RSVPButtonRow eventId={event?.id} />
          {/* <AttendanceButtonRow eventId={event?.id} /> */}
          <RSVPList eventId={event?.id} />
        </Stack>
      )}

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
