import { DataTable } from "@/components/DataTable";
import { User } from "@/generated";
import { IconButton, TableContainer } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { FaCode, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import useUsers from "../hooks/useUsers";

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("firstName", {
    id: "firstName",
    header: "First Name",
    footer: "First Name",
  }),
  columnHelper.accessor("lastName", {
    id: "lastName",
    header: "Last Name",
    footer: "Last Name",
  }),
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName} profile`, {
    id: "profile",
    header: "Profile",
    footer: "Profile",
    cell: ({ row: { original: row } }) => (
      <IconButton
        aria-label={`${row.firstName} ${row.lastName} profile`}
        as={Link}
        to={`/profile/${row.id}`}
        icon={<FaUserCircle />}
      />
    ),
  }),
  columnHelper.accessor((row) => `${row.firstName}-${row.lastName}-codes`, {
    id: "codes",
    header: "Codes",
    footer: "Codes",
    cell: ({ row: { original: row } }) => (
      <IconButton
        aria-label={`${row.firstName} ${row.lastName} codes`}
        as={Link}
        to={`/codes/${row.id}`}
        icon={<FaCode />}
      />
    ),
  }),
];

export default function UserList() {
  const users = useUsers();

  return (
    <TableContainer>
      <DataTable columns={columns} data={users.data ?? []} />
    </TableContainer>
  );
}
