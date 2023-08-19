import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { Settings } from 'luxon';
import * as Sentry from '@sentry/node';
import { SentryFilter } from './filters/SentryFilter';

Settings.defaultLocale = 'en-au';
Settings.defaultZone = 'Australia/Sydney';

async function bootstrap() {
  const logger = new Logger('Main');
  logger.log('Node Env:', process.env.NODE_ENV);

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const dsn = config.get<string>('SENTRY_DSN');
  const release = config.get<string>('VERSION');

  if (dsn && release) {
    Sentry.init({
      dsn,
      release,
    });

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new SentryFilter(httpAdapter));

    logger.log('Sentry enabled');
  }

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [config.getOrThrow('FRONTEND_URL')],
    allowedHeaders: 'X-Requested-With,Content-Type',
    credentials: true,
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  });

  app.use(helmet());
  app.use(cookieParser(config.getOrThrow('COOKIE_SECRET')));

  const redisClient = new Redis({
    host: config.get('REDIS_HOST'),
    port: parseInt(config.get('REDIS_PORT')),
    db: 0,
  });

  const redisStore = new RedisStore({
    client: redisClient,
  });

  app.use(
    session({
      secret: config.get('SESSION_SECRET'),
      resave: false,
      cookie: {
        domain: config.get('COOKIE_DOMAIN') ?? 'team3132.com',
      },
      saveUninitialized: true,
      store: redisStore,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(csurf());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: false,
      transform: true,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TDU Attendance API')
    .setDescription('TDU Attendance API for attending TDU')
    .addCookieAuth('connect.sid')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, document, {});

  await app.listen(3000);
}
bootstrap();
