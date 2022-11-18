import { api } from "@/client";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Attendance } from "@generated";
import { useEventAttendanceStatus } from "@hooks";

export interface AttendanceButtonRowProps {
  eventId?: string;
}

export const AttendanceButtonRow: React.FC<AttendanceButtonRowProps> = ({
  eventId,
}) => {
  const { attendance, mutate } = useEventAttendanceStatus(eventId);
  // const { mutate: globalMutate } = useSWRConfig();

  return (
    <ButtonGroup isAttached>
      <Button
        colorScheme={"green"}
        variant={
          attendance?.status === Attendance["status"].ATTENDED
            ? "solid"
            : "outline"
        }
        onClick={async () => {
          if (eventId) {
            const response = await api.event.eventControllerSetEventAttendance(
              eventId,
              { status: Attendance["status"].ATTENDED }
            );
            mutate(response);
            // globalMutate(
            //   `https://api.team3132.com/event/${eventId}/attendances`
            // );
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
            const response = await api.event.eventControllerSetEventAttendance(
              eventId,
              { status: Attendance["status"].NOT_ATTENDED }
            );
            mutate(response, { revalidate: false });
            // globalMutate(
            //   `https://api.team3132.com/event/${eventId}/attendances`
            // );
          }
        }}
      >
        Not Attended
      </Button>
    </ButtonGroup>
  );
};
export default AttendanceButtonRow;
