import { QueryClient } from "@tanstack/react-query";

/**
 * The global query client.
 * Don't use in React Components, use useQueryClient instead.
 */
const queryClient = new QueryClient();

export default queryClient;
