import path from "node:path";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { Settings } from "luxon";
import { AppModule } from "./app.module";
import { DiscordExceptionFilter } from "./filters/DiscordFilter";
import { ForbiddenDiscordFilter } from "./filters/ForbiddenDiscordFilter";
import { SentryFilter } from "./filters/SentryFilter";

Settings.defaultLocale = "en-au";
Settings.defaultZone = "Australia/Sydney";

async function bootstrap() {
  const logger = new Logger("Main");
  logger.log("Node Env:", process.env.NODE_ENV);

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const dsn = config.get<string>("VITE_SENTRY_DSN");
  const release = config.get<string>("VERSION");

  if (dsn && release) {
    const Sentry = await import("@sentry/node");
    Sentry.init({
      dsn,
      release,
      integrations: [
        Sentry.rewriteFramesIntegration({
          root: path.join(import.meta.dirname, "../"),
        }),
      ],
    });

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(
      new DiscordExceptionFilter(),
      new ForbiddenDiscordFilter(),
      new SentryFilter(httpAdapter),
    );

    logger.log("Sentry enabled");
  } else {
    logger.warn("Sentry disabled");
    app.useGlobalFilters(
      new DiscordExceptionFilter(),
      new ForbiddenDiscordFilter(),
    );
  }

  await app.listen(3001); // This is required for nestjs to work
}
bootstrap();
