import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HonoEnv } from "../hono";
import env from "../env";
import { auth, authResponses } from "../middleware/auth.middleware";
import { discordRoutes } from "./discord.routes";

const StatusSchema = z.object({
  isAdmin: z.boolean(),
  isAuthenticated: z.boolean(),
});

const authRoutes = new OpenAPIHono<HonoEnv>()
  .route("discord", discordRoutes)
  .openapi(
    createRoute({
      tags: ["Authentication"],
      // middleware: auth(),
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
        401: authResponses[401], // Unauthorized
      },
    }),
    async (c) => {
      const user = c.get("user");
      return c.json(
        {
          isAuthenticated: !!user,
          isAdmin: user?.roles?.includes(env.VITE_MENTOR_ROLE_ID) ?? false,
        },
        200,
      );
    },
  );

export { authRoutes };
