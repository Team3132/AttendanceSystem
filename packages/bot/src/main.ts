import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { Settings } from 'luxon';
import { SentryFilter } from './filters/SentryFilter';
import { DiscordExceptionFilter } from './filters/DiscordFilter';
import { ForbiddenDiscordFilter } from './filters/ForbiddenDiscordFilter';

Settings.defaultLocale = 'en-au';
Settings.defaultZone = 'Australia/Sydney';

async function bootstrap() {
  const logger = new Logger('Main');
  logger.log('Node Env:', process.env['NODE_ENV']);

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const dsn = config.get<string>('SENTRY_DSN');
  const release = config.get<string>('VERSION');

  if (dsn && release) {
    const Sentry = await import('@sentry/node');
    Sentry.init({
      dsn,
      release,
    });

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(
      new DiscordExceptionFilter(),
      new ForbiddenDiscordFilter(),
      new SentryFilter(httpAdapter),
    );

    logger.log('Sentry enabled');
  } else {
    logger.warn('Sentry disabled');
    app.useGlobalFilters(
      new DiscordExceptionFilter(),
      new ForbiddenDiscordFilter(),
    );
  }

  await app.listen(3001); // This is required for nestjs to work
}
bootstrap();
