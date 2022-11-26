import { Button, ButtonGroup } from "@chakra-ui/react";
import { Attendance } from "@generated";
import {
  useEventAttendanceStatus,
  useUpdateEventAttendanceStatus,
} from "@hooks";

export interface AttendanceButtonRowProps {
  eventId?: string;
}

export const AttendanceButtonRow: React.FC<AttendanceButtonRowProps> = ({
  eventId,
}) => {
  const { attendance } = useEventAttendanceStatus(eventId);
  const { mutate: mutateAttendance, isLoading: attendanceLoading } =
    useUpdateEventAttendanceStatus();
  // const { mutate: globalMutate } = useSWRConfig();

  return (
    <ButtonGroup isAttached isDisabled={attendanceLoading}>
      <Button
        colorScheme={"green"}
        variant={
          attendance?.status === Attendance["status"].ATTENDED
            ? "solid"
            : "outline"
        }
        onClick={async () => {
          if (eventId) {
            mutateAttendance({
              eventId,
              attendance: { status: Attendance["status"].ATTENDED },
            });
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
            mutateAttendance({
              eventId,
              attendance: { status: Attendance["status"].NOT_ATTENDED },
            });
          }
        }}
      >
        Not Attended
      </Button>
    </ButtonGroup>
  );
};
export default AttendanceButtonRow;
