import AsChildLink from "@/components/AsChildLink";
import Datatable from "@/components/DataTable";
import DefaultAppBar from "@/components/DefaultAppBar";
import { usersQueryOptions } from "@/queries/users.queries";

import type { UserSchema } from "@/server/schema";
import {
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { useCallback } from "react";
import { z } from "zod";

const columnHelper = createColumnHelper<z.infer<typeof UserSchema>>();

const columns = [
  columnHelper.accessor("username", {
    header: "Username",
  }),
  columnHelper.display({
    header: "Settings",
    cell: (row) => (
      <AsChildLink
        to={"/admin/users/$userId"}
        params={{
          userId: row.row.original.id,
        }}
      >
        <Button variant="outlined">Settings</Button>
      </AsChildLink>
    ),
  }),
];

const defaultValues = {
  query: "",
};

const searchSchema = z.object({
  query: z.string().default(defaultValues.query),
});

export const Route = createFileRoute("/_authenticated/admin_/")({
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(defaultValues)],
  },
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context: { queryClient }, deps: { search } }) =>
    queryClient.prefetchInfiniteQuery(
      usersQueryOptions.userList({
        limit: 10,
        search: search.query,
      }),
    ),
  head: () => ({
    meta: [
      {
        title: "Admin - Users",
      },
    ],
  }),
  component: Component,
});

function Component() {
  return (
    <>
      <DefaultAppBar title="Admin - Users" />
      <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
        <UserTable />
      </Container>
    </>
  );
}

function UserTable() {
  const { query } = Route.useSearch();
  const navigate = Route.useNavigate();

  const usersQuery = useSuspenseInfiniteQuery(
    usersQueryOptions.userList({
      limit: 10,
      search: query,
    }),
  );

  const pagedItems = useMemo(
    () => usersQuery.data.pages.flatMap((page) => page.items) ?? [],
    [usersQuery.data],
  );

  const total = useMemo(
    () => usersQuery.data.pages.at(-1)?.total ?? 0,
    [usersQuery.data],
  );

  const setSearch = useCallback(
    (v: string) =>
      navigate({
        search: {
          query: v,
        },
      }),
    [navigate],
  );

  return (
    <>
      <Stack gap={2} sx={{ height: "100%", display: "flex" }}>
        <TextField
          onChange={(e) => setSearch(e.target.value)}
          defaultValue={query}
          label="Search"
          placeholder="Search for users"
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            input: {
              endAdornment: usersQuery.isFetching ? (
                <InputAdornment position="end">
                  <CircularProgress size={"30px"} />
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
        <Datatable
          columns={columns}
          data={pagedItems}
          globalFilter={query}
          setGlobalFilter={setSearch}
          fetchNextPage={usersQuery.fetchNextPage}
          isFetching={usersQuery.isFetching}
          totalDBRowCount={total}
          fixedHeight={69.5}
          sx={{
            flex: 1,
          }}
        />
      </Stack>
    </>
  );
}
