import { DataTable } from "@/components/DataTable";
import { RsvpUser } from "@/generated";
import { TableContainer } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { DateTime } from "luxon";
import React from "react";
import useEventRSVPStatuses from "../hooks/useEventRSVPStatuses";

const columnHelper = createColumnHelper<RsvpUser>();

const columns = [
  columnHelper.group({
    id: "name",
    header: "Name",
    columns: [
      columnHelper.accessor("user.firstName", {
        header: "First Name",
        // footer: "First Name",
      }),
      columnHelper.accessor("user.lastName", {
        header: "Last Name",
        // footer: "Last Name",
      }),
    ],
  }),
  columnHelper.group({
    id: "status",
    header: "Status",
    columns: [
      columnHelper.accessor("status", {
        id: "status",
        header: "RSVP Status",
        // footer: "RSVP Status",
        cell: ({ getValue }) => {
          return readableStatus(getValue<RsvpUser.status>());
        },
      }),
      columnHelper.accessor("attended", {
        id: "attended",
        header: "Attended",
        // footer: "Attended",
        cell: (props) => (props.getValue() ? "Yes" : "No"),
      }),
    ],
  }),
  columnHelper.group({
    id: "meta",
    columns: [
      columnHelper.accessor("updatedAt", {
        id: "updatedAt",
        header: "Updated At",
        // footer: "Updated At",
        cell: (props) =>
          DateTime.fromISO(props.getValue()).toLocaleString(
            DateTime.DATETIME_MED
          ),
      }),
    ],
  }),
];

const readableStatus = (status: RsvpUser.status | null) => {
  if (status === null) {
    return "Unknown";
  } else if (status === "YES") {
    return "Coming";
  } else if (status === "MAYBE") {
    return "Maybe";
  } else {
    return "Not Coming";
  }
};

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
