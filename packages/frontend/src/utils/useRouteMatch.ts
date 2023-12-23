import { useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";

export default function useRouteMatch(patterns: readonly string[]) {
  const { pathname } = useLocation();

  const possibleMatchMemo = useMemo(() => {
    for (let i = 0; i < patterns.length; i += 1) {
      const pattern = patterns[i];
      const possibleMatch = matchPath(pattern, pathname);
      if (possibleMatch !== null) {
        return possibleMatch;
      }
    }
  }, [pathname, patterns]);

  return possibleMatchMemo;
}
