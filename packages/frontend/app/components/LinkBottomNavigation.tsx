import type { TabItem } from "@/types/TabItem";
import { BottomNavigation, type BottomNavigationProps } from "@mui/material";
import { useMatches } from "@tanstack/react-router";
import { useMemo } from "react";
import { BottomNavigationLink } from "./BottomNavigationLink";

interface LinkTabsProps extends Omit<BottomNavigationProps, "value"> {
  tabs: TabItem[];
  defaultIndex?: number;
}

/**
 * A component that renders a set of tabs that link to different routes.
 * @returns
 */
export default function LinkTabs(props: LinkTabsProps) {
  const { tabs, defaultIndex = 0, ...rest } = props;

  const currentChildren = useMatches(); // Get the current matched routes (in the entire tree)

  const matchingIndex = useMemo(() => {
    // Find the index of the tab that matches the current route
    const tabIndex = tabs.findIndex((tab) =>
      currentChildren.some((child) => child.fullPath === tab.to),
    );
    // If no tab matches, use the default index (0)
    return tabIndex === -1 ? defaultIndex : tabIndex;
  }, [currentChildren, tabs, defaultIndex]);

  return (
    <BottomNavigation value={matchingIndex} {...rest}>
      {tabs.map((route, index) => (
        <BottomNavigationLink
          label={route.label}
          icon={route.icon}
          value={index}
          to={route.to}
          params={route.params}
          key={route.label}
        />
      ))}
    </BottomNavigation>
  );
}
