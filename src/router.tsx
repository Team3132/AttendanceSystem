import { MutationCache, QueryClient, matchQuery } from "@tanstack/react-query";
// app/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { toaster } from "./components/Toaster";
import { routeTree } from "./routeTree.gen";
import type { StrictlyTypedQueryKeys } from "./server/queryKeys";

export function getRouter() {
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
      onError: (error, _vars, _onMutateResult, _mutation, _context) => {
        if (error instanceof Error) {
          toaster.error({
            title: "An error occured",
            description: error.message,
          });
        }
      },
    }),
  });

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollToTopSelectors: ["#main-area"],
    defaultPreload: "intent",
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidates?: Array<StrictlyTypedQueryKeys>;
    };
  }
}
