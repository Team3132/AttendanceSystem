import { Button, ButtonGroup } from "@chakra-ui/react";
import { useSWRConfig } from "swr";
import { Attendance } from "../generated";
import { useAuthStatus, useEventAttendanceStatus } from "../hooks";
import { setEventAttendanceStatus } from "../utils";
import { isAdmin } from "../utils/roles";

interface Props {
  eventId?: string;
}

export const AttendanceButtonRow: React.FC<Props> = ({ eventId }) => {
  const { attendance, mutate } = useEventAttendanceStatus(eventId);
  const { mutate: globalMutate } = useSWRConfig();
  const { roles } = useAuthStatus();
  const isAdminYes = roles?.some(isAdmin);
  return (
    <ButtonGroup isAttached isDisabled={!isAdminYes}>
      <Button
        colorScheme={"green"}
        variant={
          attendance?.status === Attendance["status"].ATTENDED
            ? "solid"
            : "outline"
        }
        onClick={async () => {
          if (eventId) {
            const response = await setEventAttendanceStatus(
              eventId,
              Attendance["status"].ATTENDED
            );
            mutate(response);
            globalMutate(`/api/event/${eventId}/attendances`);
          }
        }}
      >
        Attended
      </Button>
      <Button
        colorScheme={"red"}
        variant={
          attendance?.status === Attendance["status"].NOT_ATTENDED
            ? "solid"
            : "outline"
        }
        onClick={async () => {
          if (eventId) {
            const response = await setEventAttendanceStatus(
              eventId,
              Attendance["status"].NOT_ATTENDED
            );
            mutate(response);
            globalMutate(`/api/event/${eventId}/attendances`);
          }
        }}
      >
        Not Attended
      </Button>
    </ButtonGroup>
  );
};
