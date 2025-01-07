import { EventTypeSchema } from "@/server";
import { RSVPSummaryParams } from "@/server/schema/RSVPSummaryParams";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { getValidatedQuery } from "vinxi/http";
import { z } from "zod";

export const APIRoute = createAPIFileRoute("/api/export/rsvp-summary")({
  GET: ({ request, params }) => {
    const query = getValidatedQuery(RSVPSummaryParams.parse);

    return json({ message: 'Hello "/api/export/rsvp-summary"!' });
  },
});
