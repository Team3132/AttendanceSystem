import appRouter from "@/server/routers/app.router";
import { createAPIFileRoute } from "@tanstack/start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export const APIRoute = createAPIFileRoute("/api/trpc")({
	GET: ({ request }) =>
		fetchRequestHandler({
			endpoint: "/api/trpc",
			req: request,
			router: appRouter,
			createContext: () => ({}),
		}),
	POST: ({ request }) =>
		fetchRequestHandler({
			endpoint: "/api/trpc",
			req: request,
			router: appRouter,
			createContext: () => ({}),
		}),
});
