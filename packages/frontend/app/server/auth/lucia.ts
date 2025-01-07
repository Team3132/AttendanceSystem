import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionTable, userTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { Discord } from "arctic";
import env from "../env";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable); // your adapter

type DatabaseUser = typeof userTable.$inferSelect;

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		name: "l-session",
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === "production",
		},
	},
	getUserAttributes: (attributes) => ({
		username: attributes.username,
		createdAt: attributes.createdAt,
		updatedAt: attributes.updatedAt,
		roles: attributes.roles,
		defaultStatus: attributes.defaultStatus,
		additionalOutreachHours: attributes.additionalOutreachHours,
	}),
});

export const discord = new Discord(
	env.VITE_DISCORD_CLIENT_ID,
	env.VITE_DISCORD_CLIENT_SECRET,
	env.VITE_DISCORD_CALLBACK_URL,
);

export const discordDesktop = new Discord(
	env.VITE_DISCORD_CLIENT_ID,
	env.VITE_DISCORD_CLIENT_SECRET,
	env.VITE_DISCORD_DESKTOP_CALLBACK_URL,
);

// IMPORTANT!
declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<DatabaseUser, "id">;
	}
}
