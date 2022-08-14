import {
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";

interface PartialUser {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  id: string;
}

interface UserListProps {
  users: PartialUser[] | undefined;
  isLoading: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users = [],
  isLoading = false,
}) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            <Tr>
              <Td>
                <Skeleton>First Name</Skeleton>
              </Td>
              <Td>
                <Skeleton>Last Name</Skeleton>
              </Td>
              <Td>
                <Skeleton>Email</Skeleton>
              </Td>
            </Tr>
          ) : (
            users?.map((user) => (
              <Tr key={user.id}>
                <Td>{user.firstName}</Td>
                <Td>{user.lastName}</Td>
                <Td>{user.email}</Td>
              </Tr>
            ))
          )}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
export default UserList;
