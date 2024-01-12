import { RouterPaths } from "@/router";
import { useMatch, useMatchRoute, useMatches } from "@tanstack/react-router";
import { useMemo } from "react";

export default function useRouteMatch(patterns: readonly RouterPaths[]) {
  const matchRoute = useMatchRoute();
  
  patterns.forEach((pattern) => {
    const matches = matchRoute({
      to: pattern,
      fuzzy: true,
      params: {},
    })

    if 
  })

  return possibleMatchMemo;
}
