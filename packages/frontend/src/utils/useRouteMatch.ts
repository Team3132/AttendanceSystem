import type { TabItem } from "@/types/TabItem";
import { useMatchRoute } from "@tanstack/react-router";

/**
 * Get the index of the first matching route in an array of routes
 * @param patterns An array of LinkOptions including a `to` and `params` property
 */
export default function useRouteMatch(patterns: readonly TabItem[]) {
  const matchRoute = useMatchRoute();

  const matchedIndex = patterns.findIndex(
    (pattern) =>
      matchRoute({
        to: pattern.to,
        params: pattern.params,
        fuzzy: pattern.fuzzy ?? false,
        pending: true,
      }) !== false,
  );

  return matchedIndex === -1 ? undefined : matchedIndex;
}
