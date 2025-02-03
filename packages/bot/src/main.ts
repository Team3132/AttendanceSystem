import path from "node:path";
import { INestApplication, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { Settings } from "luxon";
import { AppModule } from "./app.module";
import { DiscordExceptionFilter } from "./filters/DiscordFilter";
import { ForbiddenDiscordFilter } from "./filters/ForbiddenDiscordFilter";
import { SentryFilter } from "./filters/SentryFilter";

Settings.defaultLocale = "en-au";
Settings.defaultZone = "Australia/Sydney";
const logger = new Logger("Main");

const applySentry = async (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  app: INestApplication<any>,
  dsn: string,
  release: string,
) => {
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
};

const setupApp = async () => {
  logger.log("Node Env:", process.env.NODE_ENV);

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const dsn = config.get<string>("VITE_SENTRY_DSN");
  const release = config.get<string>("VERSION");

  if (dsn && release) {
    await applySentry(app, dsn, release);
  } else {
    logger.warn("Sentry disabled");
    app.useGlobalFilters(
      new DiscordExceptionFilter(),
      new ForbiddenDiscordFilter(),
    );
  }

  return app;
};

async function bootstrap() {
  const app = await setupApp();

  await app.init(); // This is required for nestjs to work
}

bootstrap();
