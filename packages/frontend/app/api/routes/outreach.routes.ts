import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { HonoEnv } from "../hono";
import { PagedLeaderboardSchema } from "../schema/PagedLeaderboardSchema";
import { getOutreachTime } from "../services/outreach.service";
import { OutreachTimeSchema } from "../schema";
import { auth, authResponses } from "../middleware/auth.middleware";

const outreachRoutes = new OpenAPIHono<HonoEnv>().openapi(
  createRoute({
    method: "get",
    middleware: auth(),
    path: "leaderboard",
    request: {
      query: OutreachTimeSchema,
    },
    responses: {
      200: {
        description: "Get the status of the user",
        content: {
          "application/json": {
            schema: PagedLeaderboardSchema,
          },
        },
      },
      401: authResponses[401], // Unauthorized
    },
  }),
  async (c) => {
    const outreachTime = await getOutreachTime(c.req.valid("query"));

    return c.json(outreachTime, 200);
  },
);

export { outreachRoutes };
