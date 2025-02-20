import { MutationCache, QueryClient, matchQuery } from "@tanstack/react-query";
// app/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";
import type { StrictlyTypedQueryKeys } from "./server/queryKeys";

export function createRouter() {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (_data, _vars, _context, mutation) => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            mutation.meta?.invalidates?.some((queryKey) =>
              matchQuery({ queryKey }, query),
            ) ?? false,
        });
      },
    }),
  });

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      scrollToTopSelectors: ["#main-area"],
      defaultPreload: "intent",
      scrollRestoration: !import.meta.env.SSR, // Disable scroll restoration in SSR
    }),
    queryClient,
  );

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidates?: Array<StrictlyTypedQueryKeys>;
    };
  }
}
