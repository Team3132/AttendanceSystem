import db from "@/server/drizzle/db";
import { eventParsingRuleTable } from "@/server/drizzle/schema";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { eq } from "drizzle-orm";
import { ChannelType } from "@discordjs/core";
import { getDiscordBotAPI } from "@/server/services/discordService";
import { generateMessage } from "@/server/services/botService";
import { eventService } from "@/server/services";

export const APIRoute = createAPIFileRoute("/api/scheduler/$jobId/trigger")({
	GET: async ({ request, params }) => {
		try {
			const job = await db.query.eventParsingRuleTable.findFirst({
				where: eq(eventParsingRuleTable.id, params.jobId),
			});

			if (!job) {
				throw new Error("Job not found");
			}

			const botAPI = getDiscordBotAPI();

			// get events for the next day
			const nextEvents = await eventService.getNextEvents();

			const channel = await botAPI.channels.get(job.channelId);

			if (channel.type !== ChannelType.GuildText) {
				throw new Error("Channel is not a text channel");
			}

			await botAPI.channels.createMessage(job.channelId, messageData);

			return json({ success: true });
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An error occurred";
			return json({ success: false, error: errorMessage });
		}
	},
});
