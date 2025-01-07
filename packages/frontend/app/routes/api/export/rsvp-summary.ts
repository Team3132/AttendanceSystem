import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

export const APIRoute = createAPIFileRoute("/api/export/rsvp-summary")({
	GET: () => {
		// const query = getValidatedQuery(RSVPSummaryParams.parse);

		return json({ message: 'Hello "/api/export/rsvp-summary"!' });
	},
});
