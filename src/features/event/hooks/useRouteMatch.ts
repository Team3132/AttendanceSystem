import { matchPath, useLocation } from "react-router-dom";

export default function useRouteMatch(patterns: readonly string[]) {
  const { pathname } = useLocation();

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];
    if (!pattern) continue;
    const match = matchPath(pattern, pathname);
    if (match !== null) {
      return { match, i };
    }
  }
}
