import { type NavigateOptions, useChildMatches } from "@tanstack/react-router";
import { useMemo } from "react";

export type TabItem = {
  label: string;
  icon?: React.ReactElement | string;
  disabled?: boolean;
  fuzzy?: boolean;
} & NavigateOptions;

interface TabIndexProps {
  tabs: TabItem[];
  defaultIndex?: number;
}

export default function useTabIndex(options: TabIndexProps) {
  const { defaultIndex, tabs } = options;

  const currentChildren = useChildMatches();

  const matchingIndex = useMemo(() => {
    // Find the index of the tab that matches the current route
    const tabIndex = tabs.findIndex((tab) =>
      currentChildren.some((child) => child.fullPath === tab.to),
    );
    // If no tab matches, use the default index (0)
    return tabIndex === -1 ? defaultIndex : tabIndex;
  }, [currentChildren, tabs, defaultIndex]);

  return matchingIndex;
}
