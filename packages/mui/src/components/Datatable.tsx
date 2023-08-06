import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableContainerProps,
  TableHead,
  TableProps,
  TableRow,
} from "@mui/material";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Row,
  VisibilityState,
  FilterFn,
  getFilteredRowModel,
  RowSelectionState,
  OnChangeFn,
} from "@tanstack/react-table";
import React, { useMemo, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { useVirtual } from "react-virtual";

export interface DatatableProps<Data extends object>
  extends TableContainerProps {
  data: Data[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<Data, any>[];
  globalFilter?: string;
  setGlobalFilter?: (filter: string) => void;
  size?: TableProps["size"];
  enableRowSelection?: "single" | "multiple";
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  fetchNextPage?: () => void;
  isFetching?: boolean;
  totalDBRowCount?: number;
  fixedHeight?: number;
  onRowSelect?: (row: Row<Data>) => void;
}

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  fetchNextPage,
  fixedHeight,
  isFetching,
  totalDBRowCount,
  ...tableContainerProps
}: DatatableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const estimateRowSize = useMemo(() => {
    if (fixedHeight === undefined) {
      return undefined;
    }

    return () => fixedHeight;
  }, [fixedHeight]);

  const table = useReactTable({
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

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    estimateSize: estimateRowSize,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  const totalFetched = useMemo(() => {
    return rows.length;
  }, [rows]);

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (
        containerRefElement &&
        fetchNextPage &&
        totalDBRowCount !== undefined
      ) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <TableContainer
      component={Paper}
      ref={tableContainerRef}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onScroll={(e: any) =>
        fetchMoreOnBottomReached(e.target as HTMLDivElement)
      }
      {...tableContainerProps}
    >
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
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<Data>;
            return (
              <TableRow
                key={row.id}
                component="tr"
                sx={{ height: fixedHeight }}
              >
                {row.getVisibleCells().map((cell) => {
                  //   const meta: any = cell.column.columnDef.meta;
                  return (
                    <TableCell key={cell.id} component="td">
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
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
