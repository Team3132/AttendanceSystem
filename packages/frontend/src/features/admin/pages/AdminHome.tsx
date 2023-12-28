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
import { useState } from "react";

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
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const usersQuery = trpc.users.getUserList.useQuery(undefined, {
    initialData: loaderData.initialUserList,
  });

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
              data={usersQuery.data}
              globalFilter={search}
              setGlobalFilter={setSearch}
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
