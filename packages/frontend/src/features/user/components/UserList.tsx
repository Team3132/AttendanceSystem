import { DataTable } from "@/components/DataTable";
import { User } from "@/generated";
import { IconButton, TableContainer } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { FaCode, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import useUsers from "../hooks/useUsers";

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("username", {
    id: "username",
    header: "Username",
    footer: "Username",
  }),
  columnHelper.accessor((row) => `${row.username} profile`, {
    id: "profile",
    header: "Profile",
    footer: "Profile",
    cell: ({ row: { original: row } }) => (
      <IconButton
        aria-label={`${row.username} profile`}
        as={Link}
        to={`/profile/${row.id}`}
        icon={<FaUserCircle />}
      />
    ),
  }),
  columnHelper.accessor((row) => `${row.username}-codes`, {
    id: "codes",
    header: "Codes",
    footer: "Codes",
    cell: ({ row: { original: row } }) => (
      <IconButton
        aria-label={`${row.username} codes`}
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
