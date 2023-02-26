import { DataTable } from "@/components/DataTable";
import useRoles from "@/features/bot/hooks/useRoles";
import { RsvpUser } from "@/generated";
import { filter, TableContainer } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { DateTime } from "luxon";
import React, { useMemo, useState } from "react";
import useEventRSVPStatuses from "../hooks/useEventRSVPStatuses";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import Autocomplete from "@/components/Autocomplete";

const columnHelper = createColumnHelper<RsvpUser>();

const columns = [
  columnHelper.accessor("user.username", {
    header: "Name",
    // footer: "First Name",
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
  } else if(status === "LATE") {
    return "Late";
  } else {
    return "Not Coming";
  }
};

export interface RSVPListProps {
  eventId?: string;
}

interface RoleItem {
  label: string;
  value: string;
}

export const RSVPList: React.FC<RSVPListProps> = ({ eventId }) => {
  const { data: rsvps } = useEventRSVPStatuses(eventId);
  const roles = useRoles();

  const options = useMemo(() => {
    if (!roles.data) return [];
    return roles.data.map((role) => ({ label: role.name, value: role.id }));
  }, [roles.data]);

  const handleSelectedItemsChange = (selectedItems?: RoleItem[]) => {
    if (selectedItems) {
      setSelected(selectedItems);
    }
  };
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
  const [selected, setSelected] = useState<Array<RoleItem>>([]);

  const filteredRsvps = useMemo(() => {
    if (!rsvps) return [];
    if (!selected.length) return rsvps;

    return rsvps.filter((rsvp) =>
      selected.every((v) => rsvp.user.roles.includes(v.value))
    );
  }, [selected, rsvps]);

  return (
    <TableContainer>
      <Autocomplete
        options={options}
        filter={(items, filterValue) =>
          items.filter((item) =>
            item.label.toLowerCase().includes(filterValue.toLowerCase())
          )
        }
        itemToString={(item) => item?.label ?? ""}
        onChange={setSelected}
        value={selected}
      />
      <DataTable columns={columns} data={filteredRsvps ?? []} />
    </TableContainer>
  );
};

export default RSVPList;
