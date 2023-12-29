import {
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import ensureAuth from "../../auth/utils/ensureAuth";
import { queryUtils, trpc } from "@/trpcClient";
import { useLoaderData } from "react-router-dom";
import Datatable from "@/components/DataTable";
import { createColumnHelper } from "@tanstack/table-core";
import { z } from "zod";
import { UserSchema } from "backend/schema";
import LinkBehavior from "@/utils/LinkBehavior";
import { useMemo, useState } from "react";

export async function loader() {
  const initialAuthData = await ensureAuth(true);
  const initialUserList = await queryUtils.users.getUserList.ensureData();
  return {
    initialAuthData,
    initialUserList,
  };
}

const columnHelper = createColumnHelper<z.infer<typeof UserSchema>>();

const columns = [
  columnHelper.accessor("username", {
    header: "Username",
  }),
  columnHelper.display({
    header: "Settings",
    cell: (row) => (
      <Button
        variant="outlined"
        LinkComponent={LinkBehavior}
        href={`/user/${row.row.original.id}`}
      >
        Settings
      </Button>
    ),
  }),
];

export function Component() {
  const usersQuery = trpc.users.getUserList.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const pagedItems = useMemo(
    () => usersQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [usersQuery.data]
  );

  const total = useMemo(
    () => usersQuery.data?.pages.at(-1)?.total ?? 0,
    [usersQuery.data]
  );

  const [search, setSearch] = useState("");

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
              value={search}
              label="Search"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Search for users"
              fullWidth
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
