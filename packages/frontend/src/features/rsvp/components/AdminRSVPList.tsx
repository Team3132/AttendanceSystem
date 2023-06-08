import { DataTable } from "@/components/DataTable";
import useRoles from "@/features/bot/hooks/useRoles";
import { ApiError, RsvpUser, UpdateRsvpDto } from "@/generated";
import { Checkbox, filter, Select, TableContainer } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { DateTime } from "luxon";
import React, { useMemo, useState } from "react";
import useEventRSVPStatuses from "../hooks/useEventRSVPStatuses";
import Autocomplete from "@/components/Autocomplete";
import useEditUserRSVP from "../hooks/useEditUserRSVP";
import api from "@/services/api";
import { rsvpKeys } from "../hooks/keys";
import { useQuery } from "@tanstack/react-query";

function RSVPCell(rsvp: RsvpUser) {
  const editRsvp = useEditUserRSVP();
  const rsvpStatus = useQuery<RsvpUser[], ApiError, RsvpUser | undefined>({
    queryFn: () => api.event.getEventRsvps(rsvp.eventId),
    queryKey: rsvpKeys.event(rsvp.eventId),
    select: (data) => data.find((r) => r.id === rsvp.id),
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as UpdateRsvpDto["status"] | undefined;
    editRsvp.mutate({
      rsvpId: rsvp.id,
      rsvp: {
        status: value,
      },
    });
  };

  return (
    <Select
      value={rsvpStatus.data?.status ?? ""}
      onChange={handleChange}
      disabled={editRsvp.isLoading}
    >
      <option value={""}>Unknown</option>
      <option value={UpdateRsvpDto["status"].LATE}>Late</option>
      <option value={UpdateRsvpDto["status"].MAYBE}>Maybe</option>
      <option value={UpdateRsvpDto["status"].NO}>No</option>
      <option value={UpdateRsvpDto["status"].YES}>Yes</option>
    </Select>
  );
}

function AttendedCell(rsvp: RsvpUser) {
  const editRsvp = useEditUserRSVP();
  const rsvpStatus = useQuery<RsvpUser[], ApiError, RsvpUser | undefined>({
    queryFn: () => api.event.getEventRsvps(rsvp.eventId),
    queryKey: rsvpKeys.event(rsvp.eventId),
    select: (data) => data.find((r) => r.id === rsvp.id),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    editRsvp.mutate({
      rsvpId: rsvp.id,
      rsvp: {
        attended: value,
      },
    });
  };

  return (
    <Checkbox
      onChange={handleChange}
      isChecked={rsvpStatus.data?.attended ?? false}
      disabled={editRsvp.isLoading}
    />
  );
}

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
        cell: (props) => <RSVPCell {...props.row.original} />,
      }),
      columnHelper.accessor("attended", {
        id: "attended",
        header: "Attended",
        // footer: "Attended",
        cell: (props) => <AttendedCell {...props.row.original} />,
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
      columnHelper.accessor("createdAt", {
        id: "createdAt",
        header: "Created At",
        // footer: "Created At",
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
  } else if (status === "LATE") {
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
      <DataTable columns={columns} data={filteredRsvps ?? []} />
    </TableContainer>
  );
};

export default RSVPList;
