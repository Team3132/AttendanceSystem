import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HonoEnv } from "../hono";
import env from "../env";

const StatusSchema = z.object({
  isAdmin: z.boolean(),
  isAuthenticated: z.boolean(),
});

const statusRoute = createRoute({
  method: "get",
  path: "status",
  responses: {
    200: {
      description: "Get the status of the user",
      content: {
        "application/json": {
          schema: StatusSchema,
        },
      },
    },
  },
});

const authRoutes = new OpenAPIHono<HonoEnv>().openapi(
  statusRoute,
  async (c) => {
    const { user } = c.var;
    return c.json({
      isAuthenticated: !!user,
      isAdmin: user?.roles?.includes(env.VITE_MENTOR_ROLE_ID) ?? false,
    });
  },
);

export { authRoutes };
