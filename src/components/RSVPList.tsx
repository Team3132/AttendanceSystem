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
import { useAuthStatus, useEventRSVPStatuses, useUser } from "../hooks";
import { isAdmin } from "../utils/roles";

interface Props {
  eventId?: string;
}

export const RSVPList: React.FC<Props> = ({ eventId }) => {
  const { rsvps } = useEventRSVPStatuses(eventId);
  const { roles } = useAuthStatus();
  const isAdminYes = roles?.some(isAdmin);
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>RSVP Status by Name</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rsvps?.map((rsvp) => (
            <Tr key={rsvp.id}>
              <Td>
                <Username userId={rsvp.userId} />
              </Td>
              <Td>{rsvp.status.toString()}</Td>
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
