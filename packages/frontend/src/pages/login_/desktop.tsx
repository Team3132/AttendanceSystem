import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const searchParamsSchema = z.object({
  session: z.string(),
});

export const Route = createFileRoute("/login/desktop")({
  validateSearch: (search) => searchParamsSchema.parse(search),
  loaderDeps: ({ search: { session } }) => ({
    session,
  }),
  beforeLoad: async () => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const isTauri = !!(window as unknown as any).__TAURI_INTERNALS__;

    if (!isTauri) {
      throw redirect({
        to: "/login",
      });
    }
  },
  loader: ({ deps: { session } }) => {
    console.log("Loading /login/desktop", session);
    return {
      session,
    };
  },
  component: Component,
});

function Component() {
  const { session } = Route.useLoaderData();
  return <div>Hello /login/desktop! {session}</div>;
}
