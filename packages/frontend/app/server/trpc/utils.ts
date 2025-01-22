import { TRPCError } from "@trpc/server";
import { t } from ".";
import env from "../env";
import { lucia } from "../auth/lucia";
import type { Session, User } from "lucia";
import { getCookie, getHeader, setCookie } from "vinxi/http";

/**
 * API Authenticated procedure (for the bot)
 */
const enforceApiToken = t.middleware(({ next }) => {
	const authorizationHeader = getHeader("authorization");

	if (!authorizationHeader) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "API Token not set" });
	}

	const envApiToken = env.VITE_BACKEND_SECRET_TOKEN;

	if (!envApiToken) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "API Token not set in config",
		});
	}

	if (authorizationHeader !== `Bearer ${envApiToken}`) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid API Token" });
	}

	return next();
});

/**
 * API Authenticated procedure
 */
export const tokenProcedure = t.procedure.use(enforceApiToken);
