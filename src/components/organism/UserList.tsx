import { User } from "@/generated";
import {
  IconButton,
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
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

interface PartialUser {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  id: string;
}

interface UserListProps {
  users: User[] | undefined;
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
            <Th>Profile</Th>
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
              <Td>
                <Skeleton>Profile</Skeleton>
              </Td>
            </Tr>
          ) : (
            users?.map((user) => (
              <Tr key={user.id}>
                <Td>{user.firstName}</Td>
                <Td>{user.lastName}</Td>
                <Td>
                  <IconButton
                    aria-label={`${user.firstName} ${user.lastName} profile`}
                    as={Link}
                    to={`/profile/${user.id}`}
                    icon={<FaUserCircle />}
                  />
                </Td>
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
