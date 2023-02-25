import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as swStats from 'swagger-stats';
import { Settings } from 'luxon';

Settings.defaultLocale = 'en-au';
Settings.defaultZone = 'Australia/Sydney';

async function bootstrap() {
  console.log('Node Env:', process.env.NODE_ENV);

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

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
  const redisStore = connectRedis(session);

  app.use(
    session({
      secret: config.get('SESSION_SECRET'),
      resave: false,
      cookie: {
        domain: config.get('COOKIE_DOMAIN') ?? 'team3132.com',
      },
      saveUninitialized: true,
      store: new redisStore({
        client: redisClient,
      }),
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
      forbidNonWhitelisted: true,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TDU Attendance API')
    .setDescription('TDU Attendance API for attending TDU')
    .addCookieAuth('connect.sid')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // console.log(document);
  app.use(
    swStats.getMiddleware({
      swaggerSpec: document,
      onAuthenticate(req, username, password) {
        return (
          username === config.getOrThrow('STATS_USERNAME') &&
          password === config.getOrThrow('STATS_PASSWORD')
        );
      },
      authentication: true,
    }),
  );
  // app.useWebSocketAdapter(new WsAdapter(app));
  SwaggerModule.setup('api', app, document, {});

  // await app.init();
  await app.listen(3000);
  // http.createServer(server).listen(3000);

  // const httpsEnabled = config.get('HTTPS') === 'true';

  // if (httpsEnabled) {
  //   const httpsOptions = {
  //     key: fs.readFileSync('./security/localhost.key'),
  //     cert: fs.readFileSync('./security/localhost.crt'),
  //   };
  //   https.createServer(httpsOptions, server).listen(3443);
  // }
}
bootstrap();
