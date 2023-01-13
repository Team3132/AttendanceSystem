import { DataTable } from "@/components/DataTable";
import { RsvpUser } from "@/generated";
import { TableContainer } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import useEventRSVPStatuses from "../hooks/useEventRSVPStatuses";

const columnHelper = createColumnHelper<RsvpUser>();

const columns = [
  columnHelper.accessor("user.firstName", {
    header: "First Name",
    footer: "First Name",
  }),
  columnHelper.accessor("user.lastName", {
    header: "Last Name",
    footer: "Last Name",
  }),
  columnHelper.accessor("status", {
    id: "status",
    header: "Status",
    footer: "Status",
    cell: (props) => {
      return props.getValue()?.toString() ?? "Unknown";
    },
  }),
  columnHelper.accessor("attended", {
    id: "attended",
    header: "Attended",
    footer: "Attended",
    cell: (props) => (props.getValue() ? "Yes" : "No"),
  }),
  columnHelper.accessor("updatedAt", {
    id: "updatedAt",
    header: "Updated At",
    footer: "Updated At"
  })
];

export interface RSVPListProps {
  eventId?: string;
}

export const RSVPList: React.FC<RSVPListProps> = ({ eventId }) => {
  const { data: rsvps } = useEventRSVPStatuses(eventId);
  // const [sorting, setSorting] = React.useState<SortingState>([]);
  // const table = useReactTable({
  //   data: rsvps ?? [],
  //   state: {
  //     sorting,
  //   },
  //   onSortingChange: setSorting,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  // });

  return (
    <TableContainer>
      <DataTable columns={columns} data={rsvps ?? []} />
    </TableContainer>
  );
};

export default RSVPList;
