import env from "./env";
import server from "./app";
import mainLogger from "./logger";
import { registerCron } from "./registerCron";

server.listen(
  {
    port: env.PORT,
    host: "0.0.0.0",
    listenTextResolver: (addr) => `Server is listening at ${addr}`,
  },
  (err, address) => {
    if (err) {
      mainLogger.error(err);
      process.exit(1);
    }

    mainLogger.info(address);
  },
);

registerCron();

export type { AppRouter } from "./routers/app.router";
export * as Schema from "./schema";
