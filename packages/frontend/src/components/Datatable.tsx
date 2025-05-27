import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  type TableContainerProps,
  TableHead,
  type TableProps,
  TableRow,
} from "@mui/material";
import { type RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  type ColumnDef,
  type FilterFn,
  type OnChangeFn,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

export interface DatatableProps<Data extends object>
  extends TableContainerProps {
  data: Data[];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  columns: ColumnDef<Data, any>[];
  globalFilter?: string;
  setGlobalFilter?: (filter: string) => void;
  size?: TableProps["size"];
  enableRowSelection?: "single" | "multiple";
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onRowSelect?: (row: Row<Data>) => void;
}

declare module "@tanstack/table-core" {
  interface FilterFns {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    fuzzy: FilterFn<any>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export default function Datatable<Data extends object>({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
  size,
  rowSelection,
  onRowSelectionChange,
  enableRowSelection,
  ...tableContainerProps
}: DatatableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable<Data>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange,
    enableRowSelection: enableRowSelection === "multiple",
    enableMultiRowSelection: enableRowSelection === "multiple",
    enableGlobalFilter: true,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
  });

  const { rows } = table.getRowModel();

  return (
    <TableContainer component={Paper} {...tableContainerProps}>
      <Table stickyHeader size={size}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  component={"th"}
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: I'm not sure what this is
                    <div onClick={header.column.getToggleSortingHandler()}>
                      <b>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <FaArrowUp fontSize={"small"} />,
                          desc: <FaArrowDown fontSize={"small"} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </b>
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow key={row.id} component="tr">
                {row.getVisibleCells().map((cell) => {
                  //   const meta: any = cell.column.columnDef.meta;
                  return (
                    <TableCell
                      key={cell.id}
                      component="td"
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
