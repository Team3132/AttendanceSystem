import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useAuthStatus, useEventAttendanceStatuses, useUser } from "@hooks";
import { DateTime } from "luxon";

export interface AttendedListProps {
  eventId?: string;
}

export const AttendedList: React.FC<AttendedListProps> = ({ eventId }) => {
  const { attendances } = useEventAttendanceStatuses(eventId);
  const { isAdmin } = useAuthStatus();
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Attendance Status by Name</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Changed</Th>
          </Tr>
        </Thead>
        <Tbody>
          {attendances?.map((attendance) => (
            <Tr key={attendance.id}>
              <Td>
                <Username userId={attendance.userId} />
              </Td>
              <Td>{attendance.status.toString()}</Td>
              <Td>
                {DateTime.fromISO(attendance.updatedAt).toLocaleString({
                  timeStyle: "short",
                  dateStyle: "short",
                })}
              </Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Changed</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

interface UsernameProps {
  userId?: string;
}

const Username: React.FC<UsernameProps> = ({ userId }) => {
  const { user, isLoading } = useUser(userId);
  return (
    <>
      {user?.firstName} {user?.lastName}
    </>
  );
};
export default AttendedList;
