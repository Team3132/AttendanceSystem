import DefaultAppBar from "@/components/DefaultAppBar";
import { LinkTab } from "@/components/LinkTab";

import type { TabItem } from "@/types/TabItem";
import { Tabs } from "@mui/material";
import {
  Outlet,
  createFileRoute,
  useChildMatches,
} from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Component,
});

const tabs: Array<TabItem> = [
  {
    label: "Scancodes",
    to: "/profile",
  },
  {
    label: "Pending",
    to: "/profile/pending",
  },
];

function Component() {
  const currentChildren = useChildMatches();

  const matchingIndex = useMemo(
    () =>
      tabs.findIndex((tab) => {
        return currentChildren.some((child) => {
          return child.fullPath === tab.to;
        });
      }),
    [currentChildren],
  );

  return (
    <>
      <DefaultAppBar title={"Profile"} />
      <Tabs value={matchingIndex}>
        {tabs.map((tab, index) => (
          <LinkTab
            to={tab.to}
            params={tab.params}
            key={tab.label}
            label={tab.label}
            value={index}
          />
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
