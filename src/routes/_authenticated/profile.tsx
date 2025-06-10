import LinkTabs from "@/components/LinkTabs";
import type { TabItem } from "@/hooks/useTabIndex";

import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute({
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
  {
    label: "Sessions",
    to: "/profile/sessions",
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
