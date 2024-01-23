import { RouterPaths } from "@/router";
import { useMatchRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export default function useRouteMatch(patterns: readonly RouterPaths[]) {
  const matchRoute = useMatchRoute();

  const matchingPatterns = useMemo(
    () =>
      patterns.find((pattern) =>
        matchRoute({
          to: pattern,
          fuzzy: true,
          params: {},
        })
      ),
    [matchRoute, patterns]
  );

  console.log({ matchingPatterns });

  return matchingPatterns;
}
