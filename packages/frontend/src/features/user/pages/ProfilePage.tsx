import { LoaderFunctionArgs, Outlet, useLoaderData } from "react-router-dom";
import { z } from "zod";
import ensureAuth from "../../auth/utils/ensureAuth";
import queryClient from "../../../queryClient";
import userApi from "../../../api/query/user.api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import useRouteMatch from "../../../utils/useRouteMatch";
import DefaultAppBar from "../../../components/DefaultAppBar";
import { Tab, Tabs } from "@mui/material";
import LinkBehavior from "../../../utils/LinkBehavior";

const ProfileParamsSchema = z.object({
  userId: z.string().optional(),
});

interface TabItem {
  label: string;
  icon?: React.ReactElement | string;
  path: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { userId } = ProfileParamsSchema.parse(params);

  if (userId) {
    await ensureAuth(true);
  }

  const initialAuthStatus = await ensureAuth();

  const initialUser = await queryClient.ensureQueryData(
    userApi.getUser(userId),
  );

  return {
    userId,
    initialUser,
    initialAuthStatus,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const userQuery = useQuery({
    ...userApi.getUser(loaderData.userId),
    // initialData: loaderData.initialUser,
  });

  const tabs = useMemo<Array<TabItem>>(
    () =>
      !loaderData.userId
        ? [
            {
              label: "Scancodes",
              path: "/profile",
            },
            {
              label: "Pending",
              path: "/profile/pending",
            }
          ]
        : [
            {
              label: "Scancodes",
              path: `/user/${loaderData.userId}`,
            },
            {
              label: "Pending",
              path: `/user/${loaderData.userId}/pending`,
            }
          ],
    [loaderData],
  );

  const routes = useMemo(() => tabs.map((tab) => tab.path), [tabs]);

  const routeMatch = useRouteMatch(routes);

  const currentTab = routeMatch?.pattern.path;

  return (
    <>
      <DefaultAppBar
        title={`${userQuery.data?.username ?? "Loading"}'s Profile`}
      />
      <Tabs value={currentTab}>
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            label={tab.label}
            icon={tab.icon}
            value={tab.path}
            href={tab.path.replace(":userId", loaderData.userId ?? "")}
            LinkComponent={LinkBehavior}
          />
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
