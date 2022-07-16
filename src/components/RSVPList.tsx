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
import { useAuthStatus, useEventRSVPStatuses, useUser } from "@hooks";
import { DateTime } from "luxon";

export interface RSVPListProps {
  eventId?: string;
}

export const RSVPList: React.FC<RSVPListProps> = ({ eventId }) => {
  const { rsvps } = useEventRSVPStatuses(eventId);
  const { isAdmin } = useAuthStatus();

  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>RSVP Status by Name</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Changed</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rsvps?.map((rsvp) => (
            <Tr key={rsvp.id}>
              <Td>
                <Username userId={rsvp.userId} />
              </Td>
              <Td>{rsvp.status.toString()}</Td>
              <Td>
                {DateTime.fromISO(rsvp.updatedAt).toLocaleString({
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
export default RSVPList;
