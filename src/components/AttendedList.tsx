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
import { useAuthStatus, useEventAttendanceStatuses, useUser } from "../hooks";
import { isAdmin } from "../utils/roles";

interface Props {
  eventId?: string;
}

export const AttendedList: React.FC<Props> = ({ eventId }) => {
  const { attendances } = useEventAttendanceStatuses(eventId);
  const { roles } = useAuthStatus();
  const isAdminYes = roles?.some(isAdmin);
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Attendance Status by Name</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {attendances?.map((attendance) => (
            <Tr key={attendance.id}>
              <Td>
                <Username userId={attendance.userId} />
              </Td>
              <Td>{attendance.status.toString()}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Name</Th>
            <Th>Status</Th>
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
