import { Rsvp } from "@/generated";
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
import { useEventRSVPStatuses, useUser } from "@hooks";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DateTime } from "luxon";
import React from "react";

const columnHelper = createColumnHelper<Rsvp>();

const columns = [
  columnHelper.accessor("userId", {
    id: "user",
    header: "User",
    footer: "User",
    cell: (props) => {
      return <Username userId={props.getValue()} />;
    },
  }),
  columnHelper.accessor("status", {
    id: "status",
    header: "Status",
    footer: "Status",
    cell: (props) => {
      return props.getValue().toString();
    },
  }),
  columnHelper.accessor("updatedAt", {
    id: "changed",
    header: "Changed",
    footer: "Changed",
    cell: (props) => {
      return DateTime.fromISO(props.getValue()).toLocaleString({
        timeStyle: "short",
        dateStyle: "short",
      });
    },
  }),
];

export interface RSVPListProps {
  eventId?: string;
}

export const RSVPList: React.FC<RSVPListProps> = ({ eventId }) => {
  const { rsvps } = useEventRSVPStatuses(eventId);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data: rsvps ?? [],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>RSVP Status by Name</TableCaption>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <Tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
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
