import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Settings } from 'luxon';
import { SentryFilter } from './filters/SentryFilter';
import { DiscordExceptionFilter } from './filters/DiscordFilter';

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
      new SentryFilter(httpAdapter),
      new DiscordExceptionFilter(),
    );

    logger.log('Sentry enabled');
  } else {
    logger.warn('Sentry disabled');
    app.useGlobalFilters(new DiscordExceptionFilter());
  }

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [config.getOrThrow('FRONTEND_URL')],
    allowedHeaders: 'X-Requested-With,Content-Type',
    credentials: true,
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  });

  app.use(helmet());

  // app.use(csurf());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: false,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
