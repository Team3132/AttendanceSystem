import env from "./env";
import server from "./app";
import mainLogger from "./logger";
// import { registerCron } from "./registerCron";
import { registerWorker } from "./services/events.service";

export type { AppRouter } from "./routers/app.router";
export * as Schema from "./schema";
