import LinkTabs from "@/components/LinkTabs";

import type { TabItem } from "@/types/TabItem";
import { Outlet, createFileRoute } from "@tanstack/react-router";

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
  return (
    <>
      <LinkTabs tabs={tabs} />
      <Outlet />
    </>
  );
}
