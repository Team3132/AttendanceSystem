import AsChildLink from "@/components/AsChildLink";
import Datatable from "@/components/DataTable";
import DefaultAppBar from "@/components/DefaultAppBar";
import { authQueryOptions } from "@/queries/auth.queries";
import { usersQueryOptions } from "@/queries/users.queries";

import {
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { UserSchema } from "@/api/schema";
import { useMemo } from "react";
import { useDebounceValue } from "usehooks-ts";
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

export const Route = createFileRoute("/_authenticated/admin_/")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const { isAdmin } = await queryClient.ensureQueryData(
      authQueryOptions.status(),
    );
    if (!isAdmin) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: Component,
});

function Component() {
  const [search, setSearch] = useDebounceValue("", 500);

  const usersQuery = useInfiniteQuery({
    ...usersQueryOptions.userList({
      limit: 10,
      search: search,
    }),
    placeholderData: keepPreviousData,
  });

  const pagedItems = useMemo(
    () => usersQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [usersQuery.data],
  );

  const total = useMemo(
    () => usersQuery.data?.pages.at(-1)?.total ?? 0,
    [usersQuery.data],
  );

  return (
    <>
      <DefaultAppBar title="Admin" />
      <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
        {/* <Stack gap={2}> */}
        <Paper
          sx={{ p: 2, textAlign: "center", height: "100%", width: "100%" }}
        >
          <Stack gap={2} sx={{ height: "100%", display: "flex" }}>
            <Typography variant="h4">Users</Typography>
            <TextField
              onChange={(e) => setSearch(e.target.value)}
              defaultValue={""}
              label="Search"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Search for users"
              fullWidth
              slotProps={{
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
              columns={columns ?? []}
              data={pagedItems}
              globalFilter={search}
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
        </Paper>
        {/* </Stack> */}
      </Container>
    </>
  );
}
