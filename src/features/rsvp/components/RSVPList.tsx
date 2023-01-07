import { DataTable } from "@/components/DataTable";
import { Username } from "@/features/user";
import { Rsvp } from "@/generated";
import {
  TableContainer
} from "@chakra-ui/react";
import {
  createColumnHelper
} from "@tanstack/react-table";
import React from "react";
import useEventRSVPStatuses from "../hooks/useEventRSVPStatuses";

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
  columnHelper.accessor("attended", {
    id: "attended",
    header: "Attended",
    footer: "Attended",
    cell: (props) => (props.getValue() ? "Yes" : "No"),
  }),
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
