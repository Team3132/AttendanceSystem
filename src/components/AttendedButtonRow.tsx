import { Button, ButtonGroup } from "@chakra-ui/react";
import { Attendance } from "@generated";
import { useAuthStatus, useEventAttendanceStatus } from "@hooks";
import { setEventAttendanceStatus } from "@utils";
import { useSWRConfig } from "swr";

export interface AttendanceButtonRowProps {
  eventId?: string;
}

export const AttendanceButtonRow: React.FC<AttendanceButtonRowProps> = ({
  eventId,
}) => {
  const { attendance, mutate } = useEventAttendanceStatus(eventId);
  const { mutate: globalMutate } = useSWRConfig();
  const { isAdmin } = useAuthStatus();

  return (
    <ButtonGroup isAttached isDisabled={!isAdmin}>
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
            mutate(response, { revalidate: false });
            globalMutate(`/api/event/${eventId}/attendances`);
          }
        }}
      >
        Not Attended
      </Button>
    </ButtonGroup>
  );
};
export default AttendanceButtonRow;
