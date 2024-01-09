import { RouterPaths } from "@/router";
import { useMatchRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export default function useRouteMatch(patterns: readonly RouterPaths[]) {
  const matchRoute = useMatchRoute();

  const possibleMatchMemo = useMemo(() => {
    for (let i = 0; i < patterns.length; i += 1) {
      const pattern = patterns[i];
      const possibleMatch = matchRoute({
        to: pattern,
        fuzzy: true,
        params: {},
      });
      if (possibleMatch !== null) {
        return possibleMatch;
      }
    }
  }, [matchRoute, patterns]);

  return possibleMatchMemo;
}
